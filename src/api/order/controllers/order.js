"use strict";

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async find(ctx) {
    const { user } = ctx.state;

    if (!user) return await super.find(ctx);

    const { id } = user;

    const entry = await strapi.db
      .query("plugin::users-permissions.user")
      .findOne({
        where: { id: id },
        populate: ["orders"],
      });

    return {
      data: entry.orders,
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
        populate: ["orders"],
      });

    const orders = entry.orders;

    if (!orders.length) return { data: {} };

    const order = orders.find((order) => order.id == id);

    return {
      data: order,
    };
  },

  async create(ctx) {
    const { user } = ctx.state;

    if (!user) return ctx.send({ message: "Missing user" }, 404);

    const { id: userId } = user;
    const { resourceId } = ctx.request.body.data;

    const order = await strapi.entityService.create("api::order.order", {
      data: {
        user: userId,
        resource: resourceId,
      },
    });

    return {
      data: order,
    };
  },
}));
