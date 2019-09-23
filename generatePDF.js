const puppeteer = require('puppeteer');

module.exports = generatePDF = async (content, id, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setContent(content.replace(/\n/g, '<br />'));
    await page.emulateMedia('screen');
    await page.pdf({
      path: `${id}.pdf`,
      format: 'Letter',
      printBackground: true,
      margin: { top: '.75in', right: '.75in', bottom: '.75in', left: '.75in' }
    });
    res.set('Content-type:application/pdf');
    res.set(
      'Content-Disposition:attachment;filename="Jason Brunelle Cover Letter.pdf"'
    );
    console.log(__dirname);
    res.sendFile(`${__dirname}/${id}.pdf`);
    console.log('done');
    await browser.close();
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};
