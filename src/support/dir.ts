
import * as fs from 'fs';
class Dir {
  clear(directoryPath: string) {
  
    // Hapus semua file dalam direktori
    fs.readdir(directoryPath, (err, files) => {
      if (err) throw err;
  
      for (const file of files) {
        fs.unlink(`${directoryPath}/${file}`, (err) => {
          if (err) throw err;
        });
      }
  
      console.log('Semua file dalam direktori berhasil dihapus');
    });
  
  }
}
const dir = new Dir();
export default dir;