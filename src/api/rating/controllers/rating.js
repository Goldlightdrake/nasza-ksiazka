"use strict";

/**
 * rating controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::rating.rating", ({ strapi }) => ({
  async find(ctx) {
    const { user } = ctx.state;

    if (!user) return await super.find(ctx);

    const { id } = user;

    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: id },
        populate: ["ratings"],
      });

    return {
      data: entry.ratings,
    };
  },

  async findOne(ctx) {
    const { user } = ctx.state;

    if (!user) return await super.findOne(ctx);

    const { id } = ctx.params;
    const { id: userId } = user;

    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: userId },
        populate: ["ratings"],
      });

    const ratings = entry.ratings;

    if (!ratings.length) return { data: {} };

    const rating = ratings.find((rating) => rating.id == id);

    return {
      data: rating,
    };
  },

  async create(ctx) {
    const { user } = ctx.state;

    if (!user) return ctx.send({ message: "Missing user!" }, 404);

    const { id: userId } = user;
    const { resourceId, rating } = ctx.request.body.data;

    const createdRating = await strapi.entityService.create(
      "api::rating.rating",
      {
        data: {
          user: userId,
          resource: resourceId,
          rating,
        },
      }
    );

    return {
      data: createdRating,
    };
  },

  async update(ctx) {
    const { user } = ctx.state;

    if (!user) return ctx.send({ message: "Missing user!" }, 404);

    const { id: userId } = user;
    const { id } = ctx.params;
    const { resourceId, rating } = ctx.request.body.data;

    const updatedRating = await strapi.entityService.update(
      "api::rating.rating",
      id,
      {
        data: {
          user: userId,
          resource: resourceId,
          rating,
        },
      }
    );

    if (!updatedRating) return { data: {} };

    return {
      data: updatedRating,
    };
  },

  async delete(ctx) {
    const { user } = ctx.state;

    if (!user) return ctx.send({ message: "Missing user!" }, 404);

    const { id } = ctx.params;

    const deletedRating = await strapi.entityService.delete(
      "api::rating.rating",
      id
    );

    return {
      data: deletedRating,
    };
  },
}));
