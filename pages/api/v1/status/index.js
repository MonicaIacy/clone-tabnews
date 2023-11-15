function status(request, response) {
  response.status(200).json({ chave: "isso está em utf-8" });
}

export default status;
