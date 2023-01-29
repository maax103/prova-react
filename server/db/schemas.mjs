import { DataTypes } from "sequelize";

export const UserSchema = {
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  pass: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

export const sequelizeOpts = {
  dialect: "sqlite",
  storage: "./db/database.sqlite",
  logging: false,
};
