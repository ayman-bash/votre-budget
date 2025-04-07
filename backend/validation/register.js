const validator = require('validator');

const validateRegisterInput = (data) => {
  let errors = {};

  if (!data.username || data.username.trim().length < 3) {
    errors.username = 'Nom d\'utilisateur trop court (3 caractères minimum)';
  }

  if (!data.email || !validator.isEmail(data.email)) {
    errors.email = 'Email invalide';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Mot de passe trop court (6 caractères minimum)';
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = validateRegisterInput;