export class Song {
  id: string;
  artist: string;
  song: string;
  album_name: string

  constructor(id:string, artist:string, song:string, album_name:string) {
  this.id = id;
  this.artist = artist;
  this.song = song;
  this.album_name = album_name;
  }
}
