import ContactsDb from "./db";
import { ContactType } from "./enum";
import { IIdentifyBody, IOrderDetails } from "./interface";

export default class ContactsService extends ContactsDb {
  public fetchContactDetails = async (body: IIdentifyBody) => {
    const { email, phoneNumber } = body;
    const contactDetails = await this.fetchContactDetailsFromDb(body);
    if (contactDetails.length === 0) {
      const primaryContact = await this.addAsPrimary(body);
      const contact = {
        primaryContactId: primaryContact.id,
        emails: [primaryContact.email],
        phoneNumbers: [primaryContact.phoneNumber],
        secondaryContactIds: [],
      };
      return contact;
    } else {
      const primaryContact = contactDetails.filter(
        (obj) => obj.linkPrecedence == ContactType.PRIMARY
      );
      if (primaryContact && primaryContact.length == 1) {
        if (
          primaryContact[0].email == email &&
          primaryContact[0].phoneNumber == phoneNumber
        ) {
          const emails = contactDetails.map((contact) => contact.email);
          const phoneNumbers = contactDetails.map(
            (contact) => contact.phoneNumber
          );
          const secondaryContactIds = contactDetails
            .filter(
              (contact) => contact.linkPrecedence === ContactType.SECONDARY
            )
            .map((contact) => contact.id);
          const contact = {
            primaryContactId: primaryContact[0].id,
            emails,
            phoneNumbers,
            secondaryContactIds,
          };
          return contact;
        } else {
          const secondaryContact = await this.createSecondaryContact(
            primaryContact[0].id,
            email!,
            phoneNumber!
          );
          const emails = [primaryContact[0].email];
          const phoneNumbers = [primaryContact[0].phoneNumber];
          let secondaryContactIds = [] as number[];
          const linkedContacts = await this.fetchRelatedContacts(
            primaryContact[0].id
          );
          linkedContacts.forEach(
            (contact: { email: string; phoneNumber: number; id: number }) => {
              if (contact.email && !emails.includes(contact.email)) {
                emails.push(contact.email);
              }
              if (
                contact.phoneNumber &&
                !phoneNumbers.includes(contact.phoneNumber)
              ) {
                phoneNumbers.push(contact.phoneNumber);
              }
              secondaryContactIds.push(contact.id);
            }
          );
          const contact = {
            primaryContactId: primaryContact[0].id,
            emails,
            phoneNumbers,
            secondaryContactIds,
          };
          return contact;
        }
      } else if (primaryContact && primaryContact.length > 1) {
        // fetch the latest current
        primaryContact.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        await this.updateContactToSecondary(
          primaryContact[1].id,
          primaryContact[0].id
        );
        const contact = {
          primaryContactId: primaryContact[0].id,
          emails: [primaryContact[0].email, primaryContact[1].email],
          phoneNumbers: [
            primaryContact[0].phoneNumber,
            primaryContact[1].phoneNumber,
          ],
          secondaryContactIds: primaryContact[1].id,
        };
        return contact;
      }
    }
  };
}