module.exports.load_main_data_section = async (req, res) => {
    const name = req.params.name;

    try {
        const allowedSections = [
            "thong_tin_dai_ly",
            "dang_ki_dai_ly",
            "danh_sach_dai_ly",
            "lap_phieu_xuat_hang",
            "bao_cao_hang_thang",
            "bao_cao_hang_thang_admin",
            "danh_sach_dai_ly_admin",
            "quan_ly_dai_ly_admin",
            "thong_tin_admin",
            "quan_ly_loai_dai_ly",
            "lap_phieu_thu_tien",
            "duyet_phieu_xuat_hang",
            "thay_doi_quy_dinh"
        ];

        if (!allowedSections.includes(name)) {
            return res.status(404).send('<p>Phần nội dung không hợp lệ!</p>');
        }

        // Render từ views chứ không phải views/partials
        const data = {};
        res.render(name, {
            layout: false,
            ...data
        });

    } catch (error) {
        console.error("Lỗi load partial:", error);
        res.status(500).send('<p>Lỗi server!</p>');
    }
};

module.exports.loadMainSection = async (req, res) => {
    const section = req.params.section;
    const allowedSections = [
      "thong_tin_dai_ly",
      "dang_ki_dai_ly",
      "danh_sach_dai_ly",
      "lap_phieu_xuat_hang",
      "bao_cao_hang_thang",
      "bao_cao_hang_thang_admin",
      "danh_sach_dai_ly_admin",
      "quan_ly_dai_ly_admin",
      "thong_tin_admin",
      "quan_ly_loai_dai_ly",
      "lap_phieu_thu_tien",
      "duyet_phieu_xuat_hang",
      "thay_doi_quy_dinh"
];
    if (!allowedSections.includes(section)) {
      return res.status(404).render('404', { layout: false });
    }
  
    try {
      const data = {}; // nếu cần truyền thêm data
      res.render('home', {
        layout: 'main',
        section,
        ...data
      });
    } catch (err) {
      console.error(err);
      res.status(500).render('500', { layout: false });
    }
  };