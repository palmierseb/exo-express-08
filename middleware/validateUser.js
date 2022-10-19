const validateUser = (req, res, next) => {
  const { firstname, lastname, email, city, language } = req.body;
  const emailRegex = /[a-z0-9._]+@[a-z0-9-]+\.[a-z]{2,3}/;
  const errors = [];
  if (!firstname) {
    errors.push({
      field: "firstname",
      message: "Firstname is required",
    });
  } else if (firstname.length < 3) {
    errors.push({
      field: "firstname",
      message: "Firstname should contain at least 3 characters",
    });
  }
  if (!lastname) {
    errors.push({
      field: "lastname",
      message: "Lastname is required",
    });
  } else if (lastname.length < 3) {
    errors.push({
      field: "lastname",
      message: "Lastname should contain at least 3 characters",
    });
  }

  if (!email) {
    errors.push({
      field: "email",
      message: "Email is required",
    });
  } else if (!email.includes("@")) {
    errors.push({
      field: "email",
      message: "Email should contain @",
    });
  } else if (!emailRegex.test(email)) {
    errors.push({
      field: "email",
      message: "Email should be valid",
    });
  }

  if (!city) {  
    errors.push({
      field: "city",
      message: "City is required",
    });
  }
    if (!language) {
        errors.push({
            field: "language",
            message: "Language is required",
        });
    }
    if (errors.length) {
        res.status(422).json({ validationErrors: errors });
    } else {
        next();
    }
};

module.exports = validateUser;
