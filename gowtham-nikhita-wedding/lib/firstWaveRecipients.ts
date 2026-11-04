/**
 * Parties the first-wave invitation went to through Zola, taken from Zola's
 * delivery report (Recipients.docx, shared 2026-11-04). A party counts if any
 * of its members was on the report, whether or not the text was delivered.
 * The RSVP admin page uses this to list who still hasn't replied.
 *
 * Party IDs, so renames and new party members don't break the list. Sashi
 * Puvvada on the report is Sashi Padarthy, already counted.
 *
 * Left out on purpose: the couple's own parties (Gowtham Ramesh, Nikhita
 * Puvvada), and the Sreeram Puvvada party, which has a second guest also
 * named Nikhita Puvvada and only matched the report by that name.
 */
export const FIRST_WAVE_RECIPIENT_PARTY_IDS: readonly string[] = [
  'f470c437-f774-4ba1-b03c-6de4bfb82755', // Ahmed Ali
  '3ff28d8a-8512-402b-9375-2e404bf6404f', // Andy Woong
  'e870c90c-b97a-4d22-b29b-85138328e635', // Anil Divvela
  '3865a062-a2b2-4594-9baa-a63607ab5e23', // Anita Chunduru
  '2ecef0e7-987a-4ab3-aaab-dca0e5af3d31', // Anjali Nair
  '0bde8818-4dfa-47b3-8dfa-ec18b629bbc1', // Anu Cheermala
  '64851969-2fc9-4972-b7b9-68ac61b3ff60', // Babu Krishnamurthy
  '69b1c0c7-1818-4766-b68c-216670fbfad8', // Becky Nakul
  'e2718d19-e75c-4dab-8250-c708456cf4c5', // Bella Fiorentino
  '01770eff-7155-4457-be53-e7da02adbb8b', // Bharathi Iyer
  '352a3ab8-4271-4fff-a59a-4be1d258d164', // Brijal Shah
  '0fd7f51c-f79d-4267-ae5d-05acfd479f6a', // Chitra Padmanabhan
  'e74c91cf-ed2c-4557-ad31-2689b3827b7c', // Chitra Suresh
  'bbfc7e5c-6555-4c25-98d2-7f3b4e677449', // Christian Perez
  '7c861993-1450-41cd-9460-44fd7cabdc2a', // Deepika Konkimalla
  '8a3267c3-521b-475b-a15f-ae7074a3e002', // Delaney Ragsdale
  'ccfa13cc-9a40-4510-94aa-7173fb275a87', // Dhruv Patel
  '2a24b7a3-7ccf-408a-8081-772449888bee', // Freddy Ayala
  '421a826a-87b0-412a-a134-fae930327b9f', // Gabby John
  'eba9ab78-6e2a-43c5-8255-2fc1af2cfc83', // Gandhi Puvvada
  '6b32320b-9d0c-4252-bde0-f5a0f0c90b79', // Ganesh Narasimhan
  '2604d834-11aa-4599-987b-25f08bddf590', // Harish Sridharan
  'd98fa5dd-9d1d-4a85-ab5e-e4fe55b26626', // Hiren Patel
  '160dec15-d2f2-45c1-87d7-f7019073ab15', // Jack Baird
  '68bbb0c3-f6b7-460a-9374-40b7a93bf46e', // Jagannatha Rao Divvela
  '894e25c3-3633-4ac8-9f43-334d18d146dd', // Janak Raol
  '36fe24e0-9754-499c-aa5d-488252d68240', // Janani Rammohan
  '7b72da68-6e69-4e06-90c3-2eaf02226bde', // Jay Duphare
  'e867ea71-a3b1-4070-9f87-74eba723cca8', // Jean Karlo Paez-Colon
  '9ef303a4-fb80-4863-8379-7bae004d3a4b', // Jenny Rice
  'ac427f68-8099-4e2b-98c2-8540655f8744', // John Huang
  'bc4e93a7-cc5d-4c7f-9bb1-de195c5f512a', // Joi Asireddy
  '40eb27d8-acb2-41f9-b459-e9d58f0fef8f', // Jordan Bickham
  'c93106bd-6731-4a3b-8989-1572abcbdb21', // Jorge Garro
  '5ca42446-f3a0-4059-8797-670d49c59ece', // Jungwoo Seo
  'fbbe9652-2b6a-4395-bf90-34380e339087', // Jyothy Chekka
  'cab5ecab-ab99-4aa3-9114-5956896453d7', // Kala Iyengar
  '15657b38-29e1-445b-8377-1ea8eb2075b7', // Karthik Sitaraman
  '8d548bd9-d21d-4e6f-9de2-3322115ac972', // Katelyn Hubbard
  'e0251875-cb48-47b4-bdb4-39b9ccf74101', // Katherine Koop
  '6d09c6e9-92cf-4a55-92f8-81c936be880a', // Kim Gonzalez
  '0a006899-92fb-4075-b3b0-8f9fe4739a99', // Kiran Divvela
  '6e2261ba-96e2-4036-9ddf-d270512d3296', // Kishore Nathan
  '02826958-f17c-40ab-90d7-306a82127d22', // Kugathasan Subramaniam
  '33471c6d-5c4b-4025-b46f-33adcc32de53', // Lakshmi Murali
  'b8438634-87ec-4d8e-bb1f-29c9ff597081', // Latha Ganesan
  '5938ec9b-2e47-47c0-9141-d0d22f19fca9', // Linda Tran
  '2ef187ff-3146-4b79-9507-b70fbcf63f3b', // Madhavi Gunda
  'e5b574ad-664a-42a0-b34f-67c72b16df0e', // Madhu Padarthy
  '45d8deb8-9c41-4d45-949c-f8d00d93fb9e', // Mani Ganesamurthy
  '8743f737-ebc7-4101-9979-22dcc668bc6e', // Matthew Hormuth
  '11551b4e-bf37-4fe8-a9f3-e2553f26cfd0', // Megha Maturu
  '201e50dd-1af2-4a12-8392-cbd4c7dc90ef', // Murthy Kottamasu
  'ec2a54d7-cd76-4608-aaa1-3692fa389d2e', // Mythilee Kugathasan
  'd94aded1-6535-4df0-936c-92828df32f15', // Nish Kadakia
  '36d7a669-724e-4c83-94f7-d474dbdc2741', // Nithya Vaikuntam
  '49b46c75-5877-4513-99a9-22cbbbca3965', // Padma Palepu
  '26187430-fe67-41ad-9d2f-2f28786302c2', // Parth Patel
  '821925b0-51d2-44e9-b430-5887d92e811e', // Peter Do
  '04716271-7789-4dde-9e3e-7464f3ee1ecd', // Prashant Kolachala
  '7ae2554d-94fe-4568-9eb5-e58184d99711', // Puja Gorti
  '1a8db146-fcd4-437f-b6b5-a78d05fbbeec', // Rabee Elkhatib
  '00ee3ffa-d5f0-4a3b-9376-dfe547055383', // Rafael Martinez
  '1578b44c-f90a-4858-affe-84b606e310ea', // Rahima Ladak
  'b2ed12f7-1a7c-4198-80e5-f2150db52e8e', // Rakesh Puvvada
  '64a69f4b-f987-415a-8944-2e20569b2842', // Ramachandran Balasubramaniam
  '190d930a-fb7e-4f3b-af54-904c7b547560', // Ramsey Abdallah
  '6db2fe81-e7b0-4c75-9c0e-46b1592b91d4', // Rohith Raman
  '9ade0f6f-e572-4617-b440-e451188abd00', // Ruchi Mahajan
  '77cc5373-1187-4fa2-a100-85e5de0da7ec', // Sadgun Kambhampati
  'f21d87c7-ab5f-4b7d-adf9-1854a932056e', // Sadhana Sankaran
  '62ab13d7-c38d-4eac-ba0f-356b1bd7422f', // Samir Ladhani
  'daa5d977-3e44-415d-abfa-c85ac73fc25d', // Sanjana Shama
  'cb026a24-5cd5-4e61-8517-af7ed7d7dba6', // Sanjay Ghatti
  '4e36f912-e710-4d52-816f-0e0dbfd6d1d9', // Sashi Puvvada
  '7e3e1b62-5f1b-4094-b9c8-ca2e51af4cbb', // Saumya Balasubramaniam
  '0d10aa76-8f62-44ac-8212-af3641862827', // Sekar Iyer
  '56fcccaa-bc3c-48dd-b368-d8c12fe67466', // Sethu Raman
  'af1d1ae2-e14e-4695-8d60-114f9787fc8d', // Sharrief Muhammed
  '81f3f5a0-b41a-4507-a154-34bb54444e3f', // Sheena Reddy
  'df4dd6ad-fdd9-4d62-810f-ca354dc71ad5', // Shivam Patel
  'c68c1125-09c1-4ce2-ac1d-e79066c359eb', // Sona Vasudevan
  'e5f9f344-96a3-49bc-bd99-4903007d243e', // Spoorthy Bharadwaj
  'c29de27f-79c1-45f1-bb47-33cc60ee453f', // Steven Vu
  '0e1ff990-b21f-4a95-bcde-4be0777a9ee8', // Suji Raman
  '57c84bc6-09ba-4108-997c-0b9614f0efd1', // Sumedha Vadlapudi
  '14abd8fd-29c7-4e73-abd8-e5df50ebd0aa', // Sumeetha Gandreddi
  'ddfee661-6fd3-4443-bab6-a277ff624a2f', // Tony Labib
  '4cf08f65-ab12-477f-bfc3-be16794b1539', // Uma Gajjar
  '4b5d13e1-2e55-44fb-b0a3-518977e6e4b4', // Uma Krishnamurthy
  'a99ef6bb-e417-4074-8225-fd4e4e499a83', // Usha Shankar
  '2fed9777-dc76-44c6-b0f5-e712525064d7', // Vanesa Avdic
  '05b8fdb4-5e81-4089-8ac3-a45c12a222c1', // Vani Kotla
  'd4cfd2db-c464-4d91-882a-d3b807680eb8', // Varna Puvvada
  'ce3d3dff-21d7-4fcd-8da4-59b976bbc805', // Varun Ramachandran
  '5217e6b2-e10f-426d-9b43-a227ab9dbcd1', // Vasanthi Mahadevan
  '17b801be-16e4-45d7-9fa1-dadc97a73da6', // Vema Rao Puvvada
  '433911e6-0b6f-4896-a928-55a77f67a92c', // Verrell Sayles
  '4dc494c3-bd02-4133-b3c9-6e2c60e3b691', // Vikas Kottamasu
  '8e5e89c8-745b-466b-a03a-8ac7103c9540', // Vinod Puvvada
  '625cfce9-af53-4652-bd85-671b4b5c3bd1', // Visu Sankaran
  'e6a649c6-2ba7-4249-bd84-b7a20648640e', // Yesasvini Devabhaktuni
  'd0be188c-8632-4d5c-9db2-17f0d44eeac9', // Zach Nguyen
  '266dd5c7-57d5-40f0-bdd5-f2985f38bbfb', // Zain Matthew
]

/** A party from that list with members who haven't replied. */
export type NotRsvpedParty = {
  partyId: string
  partyName: string
  onHold: boolean
  // True when someone in the party has replied, but these members weren't on it
  partlyReplied: boolean
  missing: string[]
  memberCount: number
}
