'use client'

// Temporary preview page to visually audit all garment SVGs
// Visit /preview to see them all

export default function PreviewPage() {
  const files = Array.from({ length: 200 }, (_, i) => {
    const num = String(i + 1).padStart(3, '0')
    // File names from the pack
    const names: Record<number, string> = {
      1:'skirt-20',2:'skirt-19',3:'skirt-18',4:'skirt-17',5:'skirt-16',6:'skirt-15',7:'skirt-14',8:'skirt-13',9:'skirt-12',10:'skirt-11',
      11:'body-1',12:'skirt-10',13:'skirt-9',14:'skirt-8',15:'skirt-7',16:'skirt-6',17:'skirt-5',18:'skirt-4',19:'skirt-3',20:'skirt-2',
      21:'dress-49',22:'swimsuit-12',23:'dress-48',24:'pants-7',25:'pants-6',26:'pants-5',27:'pants-4',28:'pants-3',29:'pants-2',30:'pants-1',
      31:'pants',32:'shorts-1',33:'swimsuit-11',34:'shorts',35:'trousers-7',36:'trousers-6',37:'trousers-5',38:'trousers-4',39:'trousers-3',40:'trousers-2',
      41:'trousers-1',42:'trousers',43:'corset-10',44:'swimsuit-10',45:'corset-9',46:'corset-8',47:'corset-7',48:'corset-6',49:'corset-5',50:'corset-4',
      51:'corset-3',52:'corset-2',53:'corset-1',54:'brassiere-10',55:'swimsuit-9',56:'brassiere-9',57:'brassiere-8',58:'brassiere-7',59:'brassiere-6',60:'brassiere-5',
      61:'brassiere-4',62:'brassiere-3',63:'brassiere-2',64:'brassiere-1',65:'panties-6',66:'swimsuit-8',67:'swimsuit-7',68:'swimsuit-6',69:'panties-5',70:'panties-4',
      71:'panties-3',72:'panties-2',73:'panties-1',74:'thong',75:'panties',76:'brassiere',77:'swimsuit-5',78:'tank-top-2',79:'tank-top-1',80:'tank-top',
      81:'corset',82:'pyjamas',83:'body',84:'sleeveless-2',85:'sleeveless-1',86:'sleeveless',87:'skirt-1',88:'bikini-7',89:'swimsuit-4',90:'dress-47',
      91:'dress-46',92:'dress-45',93:'dress-44',94:'dress-43',95:'coat-33',96:'coat-32',97:'coat-31',98:'coat-30',99:'coat-29',100:'bikini-6',
      101:'coat-28',102:'coat-27',103:'coat-26',104:'coat-25',105:'coat-24',106:'coat-23',107:'coat-22',108:'coat-21',109:'coat-20',110:'coat-19',
      111:'bikini-5',112:'coat-18',113:'coat-17',114:'coat-16',115:'coat-15',116:'coat-14',117:'coat-13',118:'coat-12',119:'coat-11',120:'coat-10',
      121:'coat-9',122:'bikini-4',123:'coat-8',124:'coat-7',125:'coat-6',126:'coat-5',127:'coat-4',128:'coat-3',129:'coat-2',130:'coat-1',
      131:'coat',132:'shirt-14',133:'bikini-3',134:'shirt-13',135:'shirt-12',136:'shirt-11',137:'shirt-10',138:'shirt-9',139:'shirt-8',140:'shirt-7',
      141:'shirt-6',142:'shirt-5',143:'shirt-4',144:'bikini-2',145:'shirt-3',146:'shirt-2',147:'shirt-1',148:'shirt',149:'dress-42',150:'dress-41',
      151:'dress-40',152:'dress-39',153:'dress-38',154:'dress-37',155:'bikini-1',156:'dress-36',157:'dress-35',158:'dress-34',159:'dress-33',160:'dress-32',
      161:'dress-31',162:'dress-30',163:'dress-29',164:'dress-28',165:'dress-27',166:'bikini',167:'dress-26',168:'dress-25',169:'dress-24',170:'dress-23',
      171:'dress-22',172:'suit-1',173:'dress-21',174:'dress-20',175:'dress-19',176:'dress-18',177:'swimsuit-3',178:'dress-17',179:'dress-16',180:'dress-15',
      181:'dress-14',182:'dress-13',183:'dress-12',184:'dress-11',185:'dress-10',186:'dress-9',187:'dress-8',188:'swimsuit-2',189:'suit',190:'dress-7',
      191:'dress-6',192:'dress-5',193:'dress-4',194:'dress-3',195:'dress-2',196:'dress-1',197:'dress',198:'skirt',199:'swimsuit-1',200:'swimsuit',
    }
    const name = names[i + 1] || 'unknown'
    return { num, name, file: `${num}-${name}.svg` }
  })

  const categories = [
    { label: 'Skirts', items: files.filter(f => f.name.startsWith('skirt')) },
    { label: 'Dresses', items: files.filter(f => f.name.startsWith('dress')) },
    { label: 'Pants', items: files.filter(f => f.name.startsWith('pants')) },
    { label: 'Trousers', items: files.filter(f => f.name.startsWith('trousers')) },
    { label: 'Shorts', items: files.filter(f => f.name.startsWith('shorts')) },
    { label: 'Shirts', items: files.filter(f => f.name.startsWith('shirt')) },
    { label: 'Coats', items: files.filter(f => f.name.startsWith('coat')) },
    { label: 'Tank/Sleeveless', items: files.filter(f => f.name.startsWith('tank') || f.name.startsWith('sleeveless')) },
    { label: 'Corsets', items: files.filter(f => f.name.startsWith('corset')) },
    { label: 'Swimwear', items: files.filter(f => f.name.startsWith('swimsuit') || f.name.startsWith('bikini')) },
    { label: 'Underwear', items: files.filter(f => f.name.startsWith('brassiere') || f.name.startsWith('panties') || f.name === 'thong') },
    { label: 'Other', items: files.filter(f => ['body', 'body-1', 'pyjamas', 'suit', 'suit-1'].includes(f.name)) },
  ]

  return (
    <div className="max-w-4xl mx-auto px-5 py-6">
      <h1 className="font-display text-3xl text-[#0A0A0A] mb-2">SVG Preview</h1>
      <p className="text-sm text-[#A3A3A3] mb-6">All 200 garment icons — check mappings</p>

      {categories.map(cat => (
        <div key={cat.label} className="mb-8">
          <h2 className="font-display text-xl text-[#0A0A0A] mb-3 sticky top-0 bg-[#FAFAFA] py-2 z-10">{cat.label} ({cat.items.length})</h2>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {cat.items.map(f => (
              <div key={f.file} className="bg-white rounded-xl border border-[#E5E5E5] p-2 text-center">
                <img src={`/garments/${f.file}`} alt={f.name} className="w-full aspect-square object-contain mb-1" />
                <p className="text-[8px] text-[#525252] truncate">{f.num}</p>
                <p className="text-[7px] text-[#A3A3A3] truncate">{f.name}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
