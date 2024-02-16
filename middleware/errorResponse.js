function errorResponse(error, res) {
  if (error.name === "ValidationError") {
    // Mongoose validation error: Required field missing
    const requiredFieldError = {};
    for (const field of Object.keys(error.errors)) {
      requiredFieldError[field] = error.errors[field].message;
    }
    return res
      .status(400)
      .json({ name: "Validation Failed", data: requiredFieldError });
  } else if (error.name === "CastError") {
    // Mongoose cast error (e.g., invalid ObjectId)
    res.status(400).json({ name: `Invalid ${error.path}: ${error.value}` });
  }
  // Handle other types of errors if needed
  // Log the error's name and stack if available
  console.error(error.name || "Unknown Error", error.stack || error);
  return res.status(500).json({ name: "Internal Server Error" });
}

export default errorResponse;
