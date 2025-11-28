import Contacts from 'react-native-contacts';
import { Recipient } from '../types';

export async function fetchContactsAsRecipients(): Promise<Recipient[]> {
  const permission = await Contacts.requestPermission();

  if (permission !== 'authorized') {
    return [];
  }

  const contacts = await Contacts.getAll();

  return contacts
    .filter(contact => contact.displayName || contact.givenName)
    .map((contact, index) => {
      const name =
        contact.displayName ||
        [contact.givenName, contact.familyName].filter(Boolean).join(' ') ||
        'Unknown';

      const accountNumber =
        contact.phoneNumbers?.[0]?.number ||
        contact.emailAddresses?.[0]?.email ||
        'N/A';

      return {
        id: contact.recordID || `contact_${index}`,
        name,
        accountNumber,
      } as Recipient;
    });
}
