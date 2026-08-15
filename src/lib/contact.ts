export const WHATSAPP_NUMBER = "59892138522";
export const WHATSAPP_DISPLAY = "092 138 522";
export const INSTAGRAM = "poolhaus.uy";

export const waLink = (msg: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
