function successResponse(res, data) {
    res.status(201).json({
      data,
    });
  }
  
export default successResponse;
  