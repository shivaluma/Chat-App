const getAvatar = username => {
  return `https://ui-avatars.com/api/?uppercase=true&name=${username}&rounded=true&size=128&length=4&font-size=0.33`;
};

export default getAvatar;
