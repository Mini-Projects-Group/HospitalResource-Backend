const verifySeller = async (req, res, next) => {
  try {
    if (req.user.type === "seller") {
      next();
    } else {
      res.status(403).json({ message: "Access Denied", error: true });
    }
  } catch (error) {
    console.log("cdndsjkm   ");
    console.log(error);
    res.status(400).json({ message: "Some error occured", error: true });
  }
};

module.exports = verifySeller;
