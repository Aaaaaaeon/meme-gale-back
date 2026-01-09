export default (router, { services, exceptions }) => {
  const { ItemsService } = services;
  const { ForbiddenException, InvalidPayloadException } = exceptions;

  /**
   * Endpoint intelligent pour gérer les likes
   * POST /like-manager/toggle
   * Body: { meme_id: "uuid" }
   * 
   * Fonctionnalités:
   * - Toggle le like (créer si n'existe pas, supprimer si existe)
   * - Met à jour automatiquement le compteur dans memes.likes
   * - Retourne l'état actuel
   */
  router.post('/toggle', async (req, res) => {
    try {
      // Vérification de l'authentification
      if (!req.accountability || !req.accountability.user) {
        throw new ForbiddenException('Authentification requise pour liker un meme');
      }

      const { meme_id } = req.body;
      const user_id = req.accountability.user;

      // Validation du payload
      if (!meme_id) {
        throw new InvalidPayloadException('Le champ meme_id est requis');
      }

      // Services
      const memesService = new ItemsService('memes', {
        knex: services.knex,
        schema: services.schema,
        accountability: req.accountability
      });

      const likesService = new ItemsService('meme_likes', {
        knex: services.knex,
        schema: services.schema,
        accountability: req.accountability
      });

      // Vérifier que le meme existe
      let meme;
      try {
        meme = await memesService.readOne(meme_id, {
          fields: ['id', 'likes', 'title']
        });
      } catch (error) {
        throw new InvalidPayloadException(`Le meme ${meme_id} n'existe pas`);
      }

      // Vérifier si l'utilisateur a déjà liké ce meme
      const existingLikes = await likesService.readByQuery({
        filter: {
          user_id: { _eq: user_id },
          meme_id: { _eq: meme_id }
        },
        limit: 1
      });

      let isLiked = false;
      let newLikesCount = parseInt(meme.likes) || 0;

      if (existingLikes.length > 0) {
        // L'utilisateur a déjà liké : on supprime le like
        await likesService.deleteOne(existingLikes[0].id);
        newLikesCount = Math.max(0, newLikesCount - 1); // Ne pas aller en négatif
        isLiked = false;
      } else {
        // L'utilisateur n'a pas encore liké : on crée le like
        await likesService.createOne({
          user_id: user_id,
          meme_id: meme_id
        });
        newLikesCount += 1;
        isLiked = true;
      }

      // Mettre à jour le compteur de likes dans la table memes
      await memesService.updateOne(meme_id, {
        likes: newLikesCount
      });

      // Réponse
      res.json({
        success: true,
        meme_id: meme_id,
        liked: isLiked,
        totalLikes: newLikesCount,
        message: isLiked 
          ? `Vous avez liké "${meme.title}"` 
          : `Vous n'aimez plus "${meme.title}"`
      });

    } catch (error) {
      // Si c'est déjà une exception Directus, on la relance
      if (error instanceof ForbiddenException || error instanceof InvalidPayloadException) {
        throw error;
      }
      
      // Sinon, erreur générique
      console.error('Erreur like-manager:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la gestion du like',
        details: error.message
      });
    }
  });

  /**
   * Endpoint pour vérifier le statut d'un like
   * GET /like-manager/status/:meme_id
   */
  router.get('/status/:meme_id', async (req, res) => {
    try {
      // Vérification de l'authentification
      if (!req.accountability || !req.accountability.user) {
        throw new ForbiddenException('Authentification requise');
      }

      const { meme_id } = req.params;
      const user_id = req.accountability.user;

      const likesService = new ItemsService('meme_likes', {
        knex: services.knex,
        schema: services.schema,
        accountability: req.accountability
      });

      const memesService = new ItemsService('memes', {
        knex: services.knex,
        schema: services.schema,
        accountability: req.accountability
      });

      // Vérifier si l'utilisateur a liké
      const existingLikes = await likesService.readByQuery({
        filter: {
          user_id: { _eq: user_id },
          meme_id: { _eq: meme_id }
        },
        limit: 1
      });

      // Récupérer le total de likes
      const meme = await memesService.readOne(meme_id, {
        fields: ['likes']
      });

      res.json({
        meme_id: meme_id,
        liked: existingLikes.length > 0,
        totalLikes: parseInt(meme.likes) || 0
      });

    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      
      res.status(500).json({
        error: 'Erreur lors de la récupération du statut',
        details: error.message
      });
    }
  });
};
