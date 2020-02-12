import req from "node-fetch";
import { URLSearchParams } from "url";

export async function getSongs(client: any, search: any) {
  const node = client.player.nodes.first();

  const params = new URLSearchParams();

  params.append("identifier", search);

  let result;

  try {
    result = await req(
      `http://${node.host}:${node.port}/loadtracks?${params.toString()}`
    ).set("Authorization", node.password);
  } catch (error) {
    return error;
  }

  return result.body.tracks;
}

export async function handleVideo(msg, vc, song, queue): Promise<any> {
  let serverQueue = queue.get(msg.guild.id);

  song.requestedBy = msg.author;

  if (!serverQueue) {
    let queueConstruct = {
      textChannel: msg.channel,
      vc,
      player: null,
      songs: [song],
      volume: 100,
      playing: true,
      loop: false
    };

    queue.set(msg.guild.id, queueConstruct);

    try {
      queueConstruct.player = await msg.client.player.join(
        {
          guild: msg.guild.id,
          channel: msg.member.voice.channelID,
          host: msg.client.player.nodes.first().host
        },
        { selfdeaf: true }
      );

      play(msg, msg.guild, queueConstruct.songs[0], queue);
    } catch (error) {
      msg.client.logger.error(
        `Couldn't join the voice channel in: ${msg.guild.name} for: ${error}`
      );

      queue.delete(msg.guild.id);

      msg.client.playe.leave(msg.guild.id);

      return msg.util.send(
        `Oopies! I couldn't join the voice channel. The creator has been alerted.`
      );
    }
  } else {
    serverQueue.songs.push(song);

    return msg.util.send(`Queued up: \`${song.info.title}\``);
  }

  return;
}

export function play(msg, guild, song, queue) {
  let serverQueue = queue.get(guild.id);

  if (!song) {
    serverQueue.textChannel.send("Queue concluded, player has been stopped.");

    msg.client.player.leave(guild.id);

    queue.delete(guild.id);

    return;
  } else {
    serverQueue.player
      .play(song.track)
      .once("error", console.error)
      .onc("end", data => {
        if (data.reason === "REPLACED") return;

        const shiffed = serverQueue.songs.shift();

        if (serverQueue.loop === true) {
          serverQueue.songs.push(shiffed);
        }

        play(msg, guild, serverQueue.songs[0], queue);
      });

    serverQueue.player.volume(serverQueue.volume);

    return serverQueue.textChannel.send(
      `Start playing: \`${song.info.title}\` by: \`${song.info.author}\``
    );
  }
}
