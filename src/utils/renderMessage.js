const renderMessage = (res, heading, message, redirectUrl) => {
    res.render("message", {
      heading,
      message,
      redirectUrl,
      title: "Mensaje", // Cambia esto según sea necesario
    });
  };
  
  module.exports = renderMessage;