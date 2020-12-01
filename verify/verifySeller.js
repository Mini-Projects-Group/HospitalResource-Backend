const verifySeller = async (req, res, next) => {
  try {
    console.log(req.user.type_id);
    if (req.user.type_id === 2) {
      next();
    } else {
      res.status(403).json({ message: "Access Denied", error: true });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Some error occured", error: true });
  }
};

module.exports = verifySeller;
