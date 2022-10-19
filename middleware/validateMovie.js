const validatMovie = (req, res, next) => {
    const { title, director, year, color, duration } = req.body;
    const error = [];
    if (!title) {
      error.push({
        field: "title",
        message: "Title is required",
      });
    } else if (title.length >= 255) {
      error.push({
        field: "title",
        message: "Should contain less than 255 characters",
      });
    }
  
    if (!director) {
      error.push({
        field: "director",
        message: "Director is required",
      });
    }
    if (!year) {
      error.push({
        field: "year",
        message: "Year is required",
      });
    }
    if (!color) {
      error.push({
        field: "color",
        message: "Color is required",
      });
    }
    if (!duration) {
      error.push({
        field: "duration",
        message: "Duration is required",
      });
    }
  
    if (errors.length) {
      res.status(422).json({ validationErrors: errors });
    } else {
      next();
    }
  };
  
module.exports = validatMovie;