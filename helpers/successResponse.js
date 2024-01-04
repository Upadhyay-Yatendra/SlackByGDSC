function successResponse(res, data) {
    res.status(201).json({
      data,
    });
  }
  
  module.exports = successResponse;
  