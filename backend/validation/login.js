const validateLoginInput = (data) => {
    let errors = {};
  
    if (!data.email) errors.email = 'Email requis';
    if (!data.password) errors.password = 'Mot de passe requis';
  
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };
  
  module.exports = validateLoginInput;