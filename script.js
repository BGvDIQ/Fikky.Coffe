// Smooth scroll untuk navigasi
window.addEventListener('DOMContentLoaded', function() {
  // Smooth scroll untuk navigasi
  document.querySelectorAll('a.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.hash) {
        e.preventDefault();
        // Tutup offcanvas jika ada
        const offcanvasEl = document.querySelector('.offcanvas.show');
        if (offcanvasEl) {
          const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
          offcanvas.hide();
          setTimeout(() => {
            document.querySelector(this.hash).scrollIntoView({ behavior: 'smooth' });
          }, 350); // tunggu animasi offcanvas
        } else {
          document.querySelector(this.hash).scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Tangani pengiriman form agar tidak reload halaman
  var formKontak = document.getElementById('formKontak');
  if (formKontak) {
    formKontak.addEventListener('submit', function (e) {
      e.preventDefault(); // Mencegah reload
      document.getElementById('notif').style.display = 'block'; // Menampilkan notifikasi
      this.reset(); // Mengosongkan form
    });
  }

  // Dark/Light mode toggle
  const toggleBtn = document.getElementById('toggleTheme');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function() {
      document.body.classList.toggle('bg-dark');
      document.body.classList.toggle('text-white');
      document.querySelectorAll('.card').forEach(card => {
        card.classList.toggle('bg-dark');
        card.classList.toggle('text-white');
      });
      document.querySelectorAll('footer, nav').forEach(el => {
        el.classList.toggle('bg-light');
        el.classList.toggle('bg-dark');
        el.classList.toggle('text-dark');
        el.classList.toggle('text-white');
      });
    });
  }

  // Tombol Pesan: tambah pesanan ke rekap dan animasi
  document.querySelectorAll('.btnPesan').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 400);
      let menu = this.getAttribute('data-menu');
      console.log('Menu dari data-menu:', menu); // Debug log
      // Jika menu Cappuccino, cek varian radio
      if (menu === 'Cappuccino') {
        const varianRadio = document.querySelector('input[name="cappuccino_varian_menu"]:checked');
        if (varianRadio) {
          const varian = varianRadio.value;
          menu = `Cappuccino (${varian})`;
        }
      }
      // Jika menu Cappuccino Susu, cek varian radio unik
      if (menu === 'Cappuccino Susu') {
        const varianRadio = document.querySelector('input[name="cappuccino_susu_varian_menu"]:checked');
        if (varianRadio) {
          const varian = varianRadio.value;
          menu = `Cappuccino Susu (${varian})`;
        }
      }
      // Jika menu Bakso Bakar, cek varian radio
      if (menu === 'Bakso Bakar') {
        const varianRadio = document.querySelector('input[name="baksobakar_varian_menu"]:checked');
        if (varianRadio) {
          const varian = varianRadio.value;
          menu = `Bakso Bakar (${varian})`;
        }
      }
      // Jika menu Lemon Tea, cek varian radio
      if (menu === 'Lemon Tea') {
        const varianRadio = document.querySelector('input[name="lemontea_varian_menu"]:checked');
        if (varianRadio) {
          const varian = varianRadio.value;
          menu = `Lemon Tea (${varian})`;
        }
      }
      console.log('Menu setelah proses:', menu); // Debug log
      const card = this.closest('.card');
      const harga = getHarga(menu);
      console.log('Harga yang didapat:', harga); // Debug log
      pesananList.push({ menu, nama: '', jumlah: 1, catatan: '', harga });
      updateRekap();
      // Toast di atas card
      let toast = card.querySelector('.menu-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.className = 'menu-toast';
        toast.innerText = 'Pesanan ditambahkan!';
        card.appendChild(toast);
      }
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        document.getElementById('rekap').scrollIntoView({ behavior: 'smooth' });
      }, 1200);
    });
  });

  // Data pesanan sementara
  let pesananList = JSON.parse(localStorage.getItem('pesananList') || '[]');
  let editIndex = null;

  window.getHarga = function(menu) {
    console.log('getHarga dipanggil dengan menu:', menu); // Debug log
    switch (menu) {
      case 'Ayam Bakar': return 12000;
      case 'Ayam Geprek': return 12000;
      case 'Nasi Goreng Spesial': return 15000;
      case 'Ayam Penyet/Cabai Hijau': return 12000;
      case 'Ayam Lava': return 12000;
      case 'Paket Lele Cabai Hijau + Teh Manis': return 12000;
      case 'Cappuccino':
      case 'Cappuccino (HOT)':
      case 'Cappuccino (ICE)':
      case 'Cappuccino Susu (HOT)': return 5000;
      case 'Cappuccino Susu (ICE)': return 7000;
      case 'Matcha':
        console.log('Matcha ditemukan, harga: 7000'); // Debug log
        return 7000;
      case 'Air Mineral': return 5000;
      case 'Badak Susu': return 7000;
      case 'Lemon Tea': return 7000;
      case 'Dimsum': return 17000;
      case 'Bakso Bakar (8 tusuk)': return 10000;
      case 'Bakso Bakar (4 tusuk)': return 5000;
      case 'Bakso Bakar': return 10000;
      case 'Piscok': return 1000;
      case 'Nugget Goreng': return 5000;
      case 'Sosis Goreng': return 5000;
      case 'Tempe Goreng': return 5000;
      case 'Lemon Tea (ICE)': return 7000;
      case 'Lemon Tea (HOT)': return 5000;
      // Tambahan jika ada menu lain
      default:
        console.log('Menu tidak ditemukan:', menu, 'mengembalikan 0'); // Debug log
        return 0;
    }
  };

  window.updateRekap = function(editIdx = null) {
    const rekapDiv = document.getElementById('rekapList');
    if (pesananList.length === 0) {
      rekapDiv.innerHTML = '<div class="alert alert-info">Belum ada pesanan.</div>';
      document.getElementById('kirimWA').style.display = 'none';
      document.getElementById('checkoutBtn').style.display = 'none';
      localStorage.removeItem('pesananList');
      return;
    }
    let html = '<div class="table-responsive"><table class="table table-bordered align-middle"><thead><tr><th>No</th><th>Menu <br><span class="text-muted small">(Apa yang kita pesan)</span></th><th>Nama</th><th>Jumlah</th><th>Catatan</th><th>Harga</th><th>Aksi</th></tr></thead><tbody>';
    let total = 0;
    pesananList.forEach((p, i) => {
      const hargaSatuan = p.harga ? parseInt(p.harga) : getHarga(p.menu);
      const harga = hargaSatuan * parseInt(p.jumlah);
      total += harga;
      if (editIdx === i) {
        // Mode edit inline
        html += `<tr><td>${i+1}</td><td>${p.menu} <br><span class='text-muted small'>(Rp ${hargaSatuan.toLocaleString('id-ID')})</span></td>` +
          `<td><input type='text' class='form-control form-control-sm' id='editNama' value='${p.nama||''}'></td>` +
          `<td><input type='number' class='form-control form-control-sm' id='editJumlah' min='1' value='${p.jumlah}'></td>` +
          `<td><input type='text' class='form-control form-control-sm' id='editCatatan' value='${p.catatan||''}'></td>` +
          `<td>Rp ${hargaSatuan.toLocaleString('id-ID')} x <span id='editJumlahLabel'>${p.jumlah}</span> = <span class='fw-bold' id='editTotalLabel'>Rp ${harga.toLocaleString('id-ID')}</span></td>` +
          `<td><button class='btn btn-success btn-sm me-1' onclick='simpanEditPesanan(${i})'>Simpan</button><button class='btn btn-secondary btn-sm' onclick='batalEditPesanan()'>Batal</button></td></tr>`;
      } else {
        html += `<tr><td>${i+1}</td><td>${p.menu} <br><span class='text-muted small'>(Rp ${hargaSatuan.toLocaleString('id-ID')})</span></td><td>${p.nama}</td><td>${p.jumlah}</td><td>${p.catatan||'-'}</td><td>Rp ${hargaSatuan.toLocaleString('id-ID')} x ${p.jumlah} = <span class='fw-bold'>Rp ${harga.toLocaleString('id-ID')}</span></td><td><button class='btn btn-warning btn-sm me-1' onclick='editPesanan(${i})'>Edit</button><button class='btn btn-danger btn-sm' onclick='hapusPesanan(${i})'>Hapus</button></td></tr>`;
      }
    });
    html += `<tr><td colspan="5" class="text-end fw-bold">Total</td><td colspan="2" class="fw-bold">Rp ${total.toLocaleString('id-ID')}</td></tr>`;
    html += '</tbody></table></div>';
    rekapDiv.innerHTML = html;
    document.getElementById('kirimWA').style.display = 'inline-block';
    document.getElementById('checkoutBtn').style.display = 'inline-block';
    localStorage.setItem('pesananList', JSON.stringify(pesananList));
    // Tambahkan event untuk update total saat jumlah diubah
    if (editIdx !== null) {
      const jumlahInput = document.getElementById('editJumlah');
      jumlahInput.addEventListener('input', function() {
        const hargaSatuan = pesananList[editIdx].harga ? parseInt(pesananList[editIdx].harga) : getHarga(pesananList[editIdx].menu);
        const jumlah = parseInt(this.value) || 1;
        document.getElementById('editJumlahLabel').textContent = jumlah;
        document.getElementById('editTotalLabel').textContent = 'Rp ' + (hargaSatuan * jumlah).toLocaleString('id-ID');
      });
    }
  };

  window.hapusPesanan = function(idx) {
    pesananList.splice(idx, 1);
    updateRekap();
  };

  window.editPesanan = function(idx) {
    updateRekap(idx);
  };

  window.simpanEditPesanan = function(idx) {
    const nama = document.getElementById('editNama').value;
    const jumlah = document.getElementById('editJumlah').value;
    const catatan = document.getElementById('editCatatan').value;
    pesananList[idx].nama = nama;
    pesananList[idx].jumlah = jumlah;
    pesananList[idx].catatan = catatan;
    updateRekap();
  };

  window.batalEditPesanan = function() {
    updateRekap();
  };

  // Kirim ke WhatsApp
  document.getElementById('kirimWA').addEventListener('click', function() {
    if (pesananList.length === 0) return;
    let pesan = 'Halo, saya ingin memesan:\n';
    pesananList.forEach((p, i) => {
      pesan += `${i+1}. ${p.menu} x${p.jumlah} (Nama: ${p.nama}${p.catatan ? `, Catatan: ${p.catatan}` : ''})\n`;
    });
    const noWA = '6281260713931';
    const url = `https://wa.me/${noWA}?text=${encodeURIComponent(pesan)}`;
    window.open(url, '_blank');
  });

  // Modal checkout
  let modalCheckout = null;
  if (!document.getElementById('modalCheckout')) {
    const modalHtml = `<div class="modal fade" id="modalCheckout" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Checkout</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body" id="checkoutBody"></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button></div></div></div></div>`;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }
  document.getElementById('checkoutBtn').addEventListener('click', function() {
    let total = 0;
    let detail = '<ul class="list-group mb-3">';
    pesananList.forEach((p, i) => {
      const hargaSatuan = p.harga ? parseInt(p.harga) : getHarga(p.menu);
      const harga = hargaSatuan * parseInt(p.jumlah);
      total += harga;
      detail += `<li class="list-group-item d-flex justify-content-between align-items-center">${p.menu} x${p.jumlah} (Rp ${hargaSatuan.toLocaleString('id-ID')})<span>= Rp ${harga.toLocaleString('id-ID')}</span></li>`;
    });
    detail += `</ul><div class="fw-bold text-end">Total: Rp ${total.toLocaleString('id-ID')}</div>`;
    detail += `<div class='alert alert-success text-center mt-3'>Terimah Kasih Telah Pesan Makanan dan Minuman Di Fikky Coffee</div>`;
    document.getElementById('checkoutBody').innerHTML = detail;
    if (!modalCheckout) modalCheckout = new bootstrap.Modal(document.getElementById('modalCheckout'));
    modalCheckout.show();
  });

  // Inisialisasi awal rekap
  updateRekap();

  // Event tombol refresh rekap
  document.getElementById('refreshRekap').addEventListener('click', function() {
    pesananList = [];
    localStorage.removeItem('pesananList');
    updateRekap();
  });

  document.querySelectorAll('.kategori-menu-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const target = document.querySelector(this.getAttribute('data-target'));
      if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    });
  });
});