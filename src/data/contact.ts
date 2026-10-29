// Address-based search, not a verified CENARD listing. Confirm the building marker with CENARD.
const street = "Av. del Ejército 1180";
const district = "Magdalena del Mar, Lima";
const query = encodeURIComponent(`${street}, ${district}, Perú`);

export const contactLocation = {
  street,
  district,
  office: "Oficina 1404",
  embedUrl: `https://www.google.com/maps?q=${query}&output=embed`,
  externalUrl: `https://www.google.com/maps/search/?api=1&query=${query}`,
};
