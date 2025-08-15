import app from "./server";

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
