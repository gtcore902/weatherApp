/**
 * Get API documentation at https://www.geoapify.com/address-autocomplete
 */

/**
 *
 * @param {string} apiKeyAutocomplete
 * @param {string} text
 * @returns object
 */
const getAutoCompleteAdresses = async function getAutoCompleteAdresses(
  apiKeyAutocomplete,
  text
) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&limit=10&type=city&apiKey=${apiKeyAutocomplete}`
    );
    if (response.status === 404 || response.status === 400) {
      const returnErrorText = () => {
        // errorText.textContent = "Veuillez saisir une localité valide"
        // inputTextBtn.classList.add("on-error")
        throw new Error('Error: Erreur 4XX');
      };
    }
    if (!response.ok) {
      throw new Error(response.status);
    }
    const datasAdresses = await response.json();
    // console.log(datasAdresses);
    return datasAdresses;
  } catch (error) {
    console.error(error);
  }
};

export default getAutoCompleteAdresses;
