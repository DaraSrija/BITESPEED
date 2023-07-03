module.exports = (sequelize: { define: (arg0: string, arg1: { id: { type: any; autoIncrement: boolean; primaryKey: boolean; }; phoneNumber: { type: any; }; email: { type: any; }; linkedId: { type: any; allowNull: boolean; }; linkPrecedence: { type: any; }; createdAt: { type: any; }; updatedAt: { type: any; }; deletedAt: { type: any; allowNull: boolean; }; }) => any; }, Sequelize: { INTEGER: any; STRING: any; DATE: any; }) => {
  const Contacts = sequelize.define("Contacts", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    linkedId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    linkPrecedence: {
      type: Sequelize.STRING,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  });
  return Contacts;
};
