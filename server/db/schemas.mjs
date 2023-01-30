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
  type: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
};

export const ProductsSchema = {
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  seller: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};
