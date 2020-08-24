export default {
  buildPrepulatedFormForUser: ({ given_name: givenName, family_name: familyName, email }) => {
    const encodedFirstName = encodeURIComponent(givenName)
    const encodedEmail = encodeURIComponent(email)
    const optionalLastNameQueryParam = familyName ? `lastname=${encodeURIComponent(familyName)}&` : ""

    return `https://www.stridenyc.com/contact?referrer=RemoteRetro&firstname=${encodedFirstName}&${optionalLastNameQueryParam}email=${encodedEmail}`
  },
}
