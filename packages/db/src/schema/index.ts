import { createInsertSchema } from "drizzle-zod";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const nationalFirstnames = sqliteTable(
  "national_firstnames",
  {
    firstname: text("firstname").notNull(),
    year: integer("year").notNull(),
    count: integer("count").notNull(),
    sex: integer("sex").notNull(), // 1 = male, 2 = female
  },
  (table) => [primaryKey({ columns: [table.firstname, table.year, table.sex] })],
);

export const insertNationalFirstnameSchema = createInsertSchema(nationalFirstnames);

export const regionalFirstnames = sqliteTable(
  "regional_firstnames",
  {
    firstname: text("firstname").notNull(),
    year: integer("year").notNull(),
    count: integer("count").notNull(),
    sex: integer("sex").notNull(), // 1 = male, 2 = female
    region: text("region").notNull(),
  },
  (table) => [primaryKey({ columns: [table.firstname, table.year, table.sex, table.region] })],
);

export const insertRegionalFirstnameSchema = createInsertSchema(regionalFirstnames);
