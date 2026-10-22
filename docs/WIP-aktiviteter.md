# Pågående: aktivitetskapittelet (ch3)

Status: koden er endret, men tekstene mangler i oversettelsesarket. Skriving
til arket ble avvist (Google-kontoen i Claude må byttes til
rakeljohnsen@gmail.com). Ikke slå sammen med main før tekstene er inne.

## Gjort i koden
- Nytt valg `other` («Vet ikke ennå») med spørsmålstegn i stedet for bilde.
- Nytt infosteg `ch3.ask` før oppsummeringen (Bentes tekst, PLACEHOLDER).
- Oppsummeringen heter nå «Veien videre»: én oppmuntrende setning per valgt
  aktivitet (`ch3.next.<id>`, eller `ch3.next.other` hvis ingen er valgt),
  forbeholdet, så «Husk:»-punktene og kortet til en ansatt.

## Rader som skal inn i arket (key | context | no | ar)
Etter `activity.social`:
- activity.other | Activity card label, question-mark card (not decided yet) | Vet ikke ennå | لا أعرف بعد

Etter `activity.social.staff`:
- activity.other.staff | Shown to staff in NORWEGIAN only | finne en aktivitet som passer for meg

Etter `ch3.cost.right`:
- ch3.ask.title | PLACEHOLDER, Bente to write. Step before "Veien videre" | [PLACEHOLDER] Snakk med en ansatt | [PLACEHOLDER] تحدّث مع أحد الموظفين
- ch3.ask.text | PLACEHOLDER, Bente to write | [PLACEHOLDER] De ansatte på mottaket kan hjelpe deg å finne en fritidsaktivitet. På neste side får du et kort du kan vise til en ansatt du stoler på. | [PLACEHOLDER] يمكن لموظفي مركز الاستقبال مساعدتك في إيجاد نشاط ترفيهي. في الصفحة التالية ستجد بطاقة يمكنك عرضها على موظف تثق به.
- ch3.next.title | Heading of the last activities step | Veien videre | الخطوة التالية
- ch3.next.sport | Shown if the child picked this activity | Så bra at du liker å trene! Spør om det finnes et lag eller en treningsgruppe i nærheten. | رائع أنك تحب التمارين! اسأل إن كان هناك فريق أو مجموعة تدريب قريبة منك.
- ch3.next.skate | (same) | Så fint at du liker å være ute! Spør om det finnes en skatepark, turer eller andre steder å være ute der du bor. | جميل أنك تحب الخروج إلى الهواء الطلق! اسأل إن كانت هناك حديقة تزلج أو رحلات مشي أو أماكن أخرى للخروج في المكان الذي تقيم فيه.
- ch3.next.food | (same) | Så fint at du liker å lage mat! Kanskje du kan lage mat sammen med andre på mottaket, eller være kjøkkensjef en dag? | جميل أنك تحب الطبخ! ربما يمكنك الطبخ مع الآخرين في مركز الاستقبال، أو أن تكون رئيس المطبخ ليوم واحد؟
- ch3.next.games | (same) | Spill og film kan være en god pause for hodet. Spør om det finnes spillkvelder, eller om fellesrommet kan være åpent oftere. | الألعاب والأفلام قد تكون استراحة جيدة للعقل. اسأل إن كانت هناك أمسيات ألعاب، أو إن كان يمكن فتح الغرفة المشتركة أكثر.
- ch3.next.learn | (same) | Så bra at du vil lære noe nytt! Spør om kurs, leksehjelp eller biblioteket i nærheten. | رائع أنك تريد تعلّم شيء جديد! اسأل عن الدورات، أو المساعدة في الواجبات، أو المكتبة القريبة.
- ch3.next.social | (same) | Det er godt å være sammen med andre. Spør om det finnes en ungdomsklubb eller fellesaktiviteter der du bor. | من الجميل قضاء الوقت مع الآخرين. اسأل إن كان هناك نادٍ للشباب أو أنشطة مشتركة في المكان الذي تقيم فيه.
- ch3.next.other | Shown for "Vet ikke ennå", or if nothing was picked | Det er helt greit å ikke vite ennå. En ansatt kan hjelpe deg å finne en aktivitet som passer for deg. | لا بأس أبدًا ألّا تعرف بعد. يمكن لأحد الموظفين مساعدتك في إيجاد نشاط يناسبك.
- ch3.next.disclaimer | Note under the encouraging lines | Ikke alle aktiviteter finnes på alle mottak eller i alle kommuner. Men de ansatte skal hjelpe deg å finne ut hva som er mulig der du bor. Kanskje finnes det noe som ligner. | ليست كل الأنشطة متاحة في كل مراكز الاستقبال أو في كل البلديات. لكن يجب على الموظفين مساعدتك في معرفة ما هو ممكن في المكان الذي تقيم فيه. ربما يوجد شيء مشابه.

## Etterpå
npm run sync-strings (sjekk at git bare viser de nye radene), test hele
kapittelet i nettleser (norsk og arabisk, med og uten valg), opplesning med
scripts/audit-read-aloud.js, npm run flowchart (nytt steg → sjekk om bildet i
plandokumentet må settes inn på nytt), changelog + versjon 0.2.4, slett denne
fila, slå sammen med main.
