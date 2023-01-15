module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    const resourceId = data.resource.connect?.[0]?.id;
    if (!resourceId) return;
    strapi.entityService
      .findOne("api::resource.resource", resourceId, {
        populate: "*",
      })
      .then((resource) => {
        const ratingSum = () => {
          let sum = 0;
          resource.ratings.forEach((rating) => {
            sum += rating.rating;
          });
          return sum;
        };
        const ratingAvg = ratingSum() / resource.ratings.length;
        strapi.entityService.update("api::resource.resource", resource.id, {
          data: {
            ratingAvg,
          },
        });
      });
  },
  async beforeUpdate(event) {
    const { where } = event.params;
    const rating = await strapi.entityService.findOne(
      "api::rating.rating",
      where.id,
      {
        populate: "resource",
      }
    );
    const resourceId = rating.resource.id;
    if (!resourceId) return;
    strapi.entityService
      .findOne("api::resource.resource", resourceId, {
        populate: "ratings",
      })
      .then((resource) => {
        const ratingSum = () => {
          let sum = 0;
          resource.ratings.forEach((rating) => {
            sum += rating.rating;
          });
          return sum;
        };
        const ratingAvg = ratingSum() / resource.ratings.length;
        strapi.entityService.update("api::resource.resource", resource.id, {
          data: {
            ratingAvg,
          },
        });
      });
  },
  async beforeDelete(event) {
    const { where } = event.params;
    const rating = await strapi.entityService.findOne(
      "api::rating.rating",
      where.id,
      {
        populate: "resource",
      }
    );
    const resourceId = rating.resource.id;
    event.state = { resourceId };
  },
  async afterDelete(event) {
    const { resourceId } = event.state;
    if (!resourceId) return;
    strapi.entityService
      .findOne("api::resource.resource", resourceId, {
        populate: "ratings",
      })
      .then((resource) => {
        let ratingAvg = null;
        if (resource.ratings.length !== 0) {
          const ratingSum = () => {
            resource.ratings.forEach((rating) => {
              sum += rating.rating;
            });
            return sum;
          };
          ratingAvg = ratingSum() / resource.ratings.length;
        }
        strapi.entityService.update("api::resource.resource", resource.id, {
          data: {
            ratingAvg,
          },
        });
      });
  },
};
