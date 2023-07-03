import { IIdentifyBody, IOrderDetails } from "./interface";
import db from "../models/db";
import { Sequelize, Op } from "sequelize";
import { ContactType } from "./enum";
export default class ContactsDb {
  public fetchContactDetailsFromDb = async (body: IIdentifyBody) => {
    const { email, phoneNumber } = body;
    let whereClause = {};
    if (email && phoneNumber) {
      whereClause = { [Op.or]: [{ email }, { phoneNumber }] };
    } else if (!email) {
      whereClause = { phoneNumber };
    } else if (!phoneNumber) {
      whereClause = { email };
    }
    const contactDetails = (await db.Contacts.findAll({
      where: whereClause,
      raw: true,
    })) as unknown as IOrderDetails[];

    return contactDetails;
  };
  public addAsPrimary = async (body: IIdentifyBody) => {
    const { email, phoneNumber } = body;
    const primaryContact = await db.Contacts.create({
      phoneNumber,
      email,
      linkPrecedence: ContactType.PRIMARY,
    });
    return primaryContact;
  };
  public createSecondaryContact = async (
    linkedId: number,
    email: string,
    phoneNumber: number
  ) => {
    const secondaryContact = await db.Contacts.create({
      linkedId,
      phoneNumber,
      email,
      linkPrecedence: ContactType.SECONDARY,
    });
    return secondaryContact.dataValues;
  };

  public updateContactToSecondary = async (
    contactId: number,
    linkedId: number
  ) => {
    return await db.Contacts.update(
      {
        linkPrecedence: ContactType.SECONDARY,
        linkedId,
      },
      {
        where: {
          id: contactId,
        },
      }
    );
  };
  public fetchRelatedContacts = async (linkedId: number) => {
    return await db.Contacts.findAll({
      where: {
        linkedId,
      },
      raw: true,
    });
  };
}