const Mutations = {
  createDog(parent, args, ctx, info) {
    global.dogs = global.dogs || [];
    const newDawg = { name: args.name };
    global.dogs.push(newDawg);
    return newDawg;
  }
};

module.exports = Mutations;
