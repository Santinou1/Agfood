const renderMessageAdmin = (res, heading, message, redirectUrl) => {
    res.render("messageAdmin", {
      heading,
      message,
      redirectUrl,
      title: "Mensaje", // Cambia esto según sea necesario
    });
  };
  
  module.exports = renderMessageAdmin;