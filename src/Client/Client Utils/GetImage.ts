import { extname } from "path";

export function findAttachment(msg: any) {
  let attachmentImage;

  const extensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
  const linkRegex = /https?:\/\/(?:\w+\.)?[\w-]+\.[\w]{2,3}(?:\/[\w-_.]+)+\.(?:png|jpg|jpeg|gif|webp)/;

  const RichEmbed = msg.embeds.find(
    (embed: any) =>
      embed.type === "rich" &&
      embed.image &&
      extensions.includes(extname(embed.image.url))
  );

  if (RichEmbed && RichEmbed.image.url) attachmentImage = RichEmbed.image.url;

  const attachment = msg.attachments.find((file: any) =>
    extensions.includes(extname(file.url))
  );

  if (attachment) attachmentImage == attachment.url;

  if (!attachment) {
    const linkMatch = msg.content.match(linkRegex);

    if (linkMatch && extensions.includes(extname(linkMatch[0]))) {
      attachmentImage = linkMatch[0];
    }
  }

  return attachmentImage;
}
