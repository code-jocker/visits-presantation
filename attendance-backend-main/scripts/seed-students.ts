import { Sequelize, QueryTypes } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const databaseUrl = process.env.DATABASE_URL?.replace(/[?&]sslmode=\w+/, "");

const sequelizeOptions = {
  host: process.env.DB_HOST || "pg-d3e0b7b-princeshyakaclever-6fa6.a.aivencloud.com",
  port: Number(process.env.DB_PORT || "13480"),
  dialect: "postgres" as const,
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, sequelizeOptions)
  : new Sequelize(
      process.env.DB_NAME || "defaultdb",
      process.env.DB_USER || "avnadmin",
      process.env.DB_PASSWORD || "",
      sequelizeOptions,
    );

const classStudentMap: Record<string, string[]> = {
  "S1A": [
    "ABEREYIMANA James","ABIMANA HIRWA Gany Blessing","AHISHAKIYE MANZI Aime Miguel","ASHIMWE Nate Brayan","Benedicto King Samuel","BUGINGO BEZA Keny","GASHUMBA NDAYISHIMIYE KIM Kenedy","IGENUKWISHATSE BYISHIMO Jean Maurice","IGIRANEZA CYUSA Milton","IHUMURE NSENGIYUMVA Heroine","INEZA Queen Deborah","IRABARUTA MUGISHA Credo","IRAKOZE Belle Amie","IRAKOZE Janviere","IRAKOZE Yanis","ISHIMWE UWASE Gabriella","ISIMBI UWASE Joyeuse","ITANGANEZA Parfait","KAMIKAZI Patience","MUNEZERO Enock","MUNEZERO Priscilla","MUTONIWASE Benitha","MUVUNYI UWIMPUHWE Benie Hortance","MWITENEZA Jean Pierre","NDARUHUTSE Danny","NGABONZIZA MUGISHA Boris","NGANZO Born Bercee","RORIRORA Gihozo Anella","UWANYAGASANI Cedrick","UWASE Benitha","UWIDUHAYE Pascaline","UWINEZA AKALIZA Martina","UWIZEYIMANA Valentine","YUBAHWE Anitha"
  ],
  "S1B": [
    "ABAYISENGA Emmu Shalom","AMANI NSHUTI Claver","ARERWENEZA Laetitia","BAGABE Dieudonne","CYOMORO Nicky Prince","GAGA Lioness","IGANZE Olla Mireille","IGIRIMBABAZI Pamella","INEZA Aure Alexandrine","INEZA Deborah","INEZA KAMIKAZI TETA Promesse","IRAGENA Gloria","IRAGENA Laetitia","IRAME MUCYO Angelo","ISHEMA Rayan","ISHIMWE NGABO Hertier","ISHIMWE Olga","ISINGIZWE Ange Afurika Maombe","KAYITARE Caleb","KEZA UMI Abdoulatomani","KUNDA Beny Bienaime","KWIZERA MUHOZA Prince","MANZI Boaz","MBABAZI Blessed","MUNEZERO Gentil Hertier","MUNEZERO Yvette","MUTONIWASE Esther","NDIKUMWENAYO Jeannette","NIRAGIRE Aline","NIYONZIMA Lucky","RUDASINGWA","SHAMI Ianis Vangelis","UWASE GASARO Kelia","UWASE Sendrine","UWIZEYIMANA Chakilla","UYIZERA Regis"
  ],
  "S2A": [
    "BYISHIMO Remy","BAHO AKARIZA Kevine","DUKUZUMUREMYI Janvier","GANZA AHADI TRESOR","IHIRWE Benitha","IKUNDABAYO Kevin","IMFURAYASE Aimee Ange","INEZA QUEEN LOVE","INEZA Ryan Merci","IRASUBIZA NANSI Nadia Lenatha","ISHIMWE Brianna","ISUMBINGABO HIRWA HERVE","KALIZA UNEJEJE Ella Blassia","KAREKEZI SHIMWA SYLIVIE","KWIZE David","KWIZERA Richard","MANZI GANZA Fred","MBABAZI DORCAS","MUBIIRIGI Cyusa Prince","MUCYO MUGWANEZA Magnifique","MUSENGIMANA Marie Divine","NGABO Prince","NIYOMUKIZA STANISLAS","NIZEYIMANA Etienne","NYIRAHABAMUNGU Janviere","SHEMA NZAYITURIKI Benoit","TUYIZERE Solange","UFITEYEZU SERGE","UMUKUNDWA QUEEN VANESSA","UWAMASHIMWE JEANNETTE","UWASE Fabiola","UWIMANA Fideline","UWIMPUHWE JEROME","UWIZEYIMANA Patrick"
  ],
  "S2B": [
    "ABE MUGISHA Antoine","ABIJURU Gift Kelly Joel","AGASARO Liza Briante","CYOMORO NIYONZIMA Iba Bright","GIRUMUGISHA MASSIMO","HERO KARENGERA Keutch","HIRWA KAZE Danyllo","IGIHOZO Kellia","IGIKUNDIRO Fiston","IRERA PROMISE","IRIZA GWIZA Clenie","ISHIMWE YVETTE","ISHIMWE Belyse","ISHIMWE NGABO Victory","KABANDA RUTERANA He Calvin","KAMALI IGIHOZO IRANZI Marie Mercie","KEZA SANGWA DIVINE","KWIBUKA GIFT CARTINE Arnal","MARIYAMUNGU JUDITH","MUTAGANDA Micky","NDAMUKUNDA GISA CHANELLA","NEZA LIZA Kenia","NIKWIMANIGIZE Bonheur","NIWEKARABO KELIA WIVINE","RWEMA NTETE Arthur","SEBAHIRE MUHINEZA Emmaus","TURIKUMWE LOVE MORE","TUYIZERE Mudathiru","UMWARI GATETE Christa","UWASE GIHOZO Chanella","UWINSHUTI Evelyne"
  ],
  "S3A": [
    "ABAYO Samuella","BYIRINGIRO GWIZA SALOMON","IGIHOZO EVA ALLEN QUEEN","IGIZENEZA Benoit Gratus","IHIRWE FLORA","IHOZO Carine","IKUZWE TETA LEATITIA","INEZA Confiance Princesse","INEZA PIERRA","INEZA RUTAYISIRE Kellia","ISHIMWE KEVIN PRINCE","ISHIMWE NOELLA","KAYITARE Brave","MBIKESHIMANA SECONDINE","MUGANWA MAURICE","MUSHIME ISHEJA Natasha","MUYISENGE Gisele","NIWEMUGENI GENNIFER","NIYIBIZI ESPERANCE","NIYIGENA JEANNETTE","NIYO IGIRANEZA Emmanuel","NIYOGIKUNDIRO PASCALINE","NIYOMUKIZA ANYSIA","NIYO NGENZI DAVE FRIEND","NKURUNZIZA INEZA Messi","NSENGIMANA Benjamin","NTIVUGURUZWA Samuel","RUKUNDO Djabil","SHAMI IRAKOZE ALLIANCE","SHEMA HAGUMA Prince Gabin","TETA MARIE CLAIRE","TETERO Lucie","UMUGANWA Hidaya Aisha","UMUKUMBURWA MPETA FIDELINE","UWOYIREMEYE Faida"
  ],
  "S3B": [
    "AKIMANIZANYE AGNES","ASHIMWE Aime Gloria","DUSABIMANA NIYIGENA Aline","GIHOZO IRIZA ENOLLA","HAKIZUMWAMI Samuel","HIRWA MANZI HAPPINESS","IGIRANEZA ESTHER","IHIRWE NSHUTI Ian Jadyne","IKUZO ELLA","IKUZWE ADUHIRE Louange","INEMA SYLVIA HEAVEN","INEZA NSHUTI HERVE","INEZA Peace","INGABIRE Ines","IRAGENA CYIZA Belyse","KATUSIME Jeanne d'Arc","MIZERO Aliane","MUGABEKAZI Parfaite","MUHAWENIMANA Nadine","MUNEZERO ROSINE","MUSENGIMANA Ella Joy","MUTESA NELICKY","NGANZO Nalada","NIRAGIRE MIGNONE","NIYIGENA MUCYO MERCI MAXIME","NIYONGIRA Rene","NIYUBAHWE BIRORI Gloria","NTWALI SHEMA Honore","PENDA Oceanne Pamella","TUYISHIMIRE KEVINE","UMUBYEYI SENGA Benigne","UMUHIRE Keza Odreille","UMWARI Natasha","UWIZEYE IRASUBIZA ERNESTINE"
  ],
  "S4A": [
    "AGABE Ines Joe","DUSABIMANA Solange","HABIHIRWE Jackson","IGENITUJE Divine","IGIRANEZA Grace","IMFURAYASE Aime","INEZA Regis","IRAKOZE Giselle","IRAKOZE Lewis","IRAKOZE UMWARIWASWE Hornella","IRANZI NSABIMANA Pacifique","ISHIMWE Cynthia","ISHIMWE Diane","ITETO Christian","IZABAYO Yefuta","MUGISHA Ivan","MUHOZA Shalon","MUKANDAHIMANA Bonifilde","MUSO Lysa","MUTESIWASE Clarisse","MUTIMUTUJE Marie Louise","NAMUMPA Jane","NGABOYISONGA Blaise","NIYIGENA Josiane","NTWARI Bertin","TUMUKUNDE Emertha","UKWIGIZE Jacque","UMUHOZA Anitha","UMUHOZA Clarisse","UMWARI Fiona","UWAYO Beyonce","UWUMUGISHA Bless","INGABIRE KAYIBANDA Germaine","MUNEZERO Clemence"
  ],
  "S4B": [
    "AKARABO Ouesta Delice","AMASHIMWE Emelyne","CYUZUZO Rachel","HABIYAREMYE Elie","HAVUGIMANA Jacque","IGIRANEZA Chance","IGIRANEZA Noella","IKIREZI IMPANO","INEZA IZERE Divine","ISHIMWE Divin Ivan","KAMIKAZI Belyse Ornella","KARANGWA HIRWA Ian","KEZA Cressy Alivina","KUBWIMANA Lydia","MUGISHA Honore","MUTUYIMANA Annualithe","NDACYAYISENGA Anne","NGANZO Narada","NIYONKURU Eric","NIYONKURU Ruth","NIYONSABA Rebecca","NIYOSINJYE Hope Kelia","NYINAWUMUNTU Esther","RWEMA Edgar","TUYIRINGIRE Hope","UMUMARARUNGU Anitha","UMURERWA Divine","UWAJENEZA Leatitia","UWASE Deborah","UWAYISABA Diane","UWIRORA Alice","GAHONGAYIRE Pauline","MUTONI Queen","UMUGWANEZA Beyonce","UWAYO Ester","UWITUZE Melisa"
  ],
  "S5A": [
    "ABERA Esther","AMIZERO Nadine","BAHATI Cleb","BYIRINGIRO Justine","HIRWA Bertin","HUMURIZIBYOSE Ange","INEZA Alliance Benie","INEZA Joy","INGABIRE TETA Sabrine","IRADUKUNDA Immaculee","IRAGENA Solange","IRAKOZE Aime","IRAKOZE Pascaline","ISHIMWE TUYISENGE Emma","ITUZE GWIZA Sabrine","KEZA EPA","KILUNGI Naomie","MBARUTSO IKUNDWE Bertin","MUCYO Ignace Omega","MUKAHIRWA Julienne","MUKUNDWA Faith","MUNYANA Kellen","MUTAMBA Xenie","NDAYIZEYE Angelique","NIYOBYOSE Revelien","NIYODUSENGA Devotha","NIYONIZEYE Jean d'Amour","NSHIMIYUMUKIZA Liliane","NYIHANZAMASO Yvette","NYIRANSENGIYUMVA Aliance","SHIMIRWA Caline","TUMUSHIME Vedaste","TUYAMBAZE Beatha","TUYISHIMIRE Divine","UMUGWANEZA Pascaline","UMUGWANEZA Scovia","UMUTONI Pascaline","UMUTONIWASE Blandine","UWASE Jeannine","UWASE KABUGO Aline","UWIMANA Odila","UWIRINGIYIMANA Egidie","UWIZEYIMANA Odette","UZAYISENGA Hannah","IRAGANJE Thanks","MUSANGANYA Elyse"
  ],
  "S5B": [
    "ABIJURU Josiane","AKIMANA Cecile","ASHIMIMANA Clementine","GIKUNDIRO TUMUKUNDE Emelyne","HIRWA Fabrice","IGIRANEZA David","IGIRIMBABAZI Emelyne","IGIZENEZA Divine","INEZA Veronique","IRADUKUNDA Rahab","IRAGENA KAYIRANGWA Elysa","IRAKOZE Marlene","IRANZI Aime","ISHIMWE Fabrice","ISHIMWE Velentine","KAMIKAZI Derlene","MASEZERANO Fabrice","MINAKUZESA Amina","MUGABE Robert","MUHAWENIMANA Noella","MUKESHIMANA Jeannette","MUKIRE WINNY Nicole","MUSHIMIYIMANA Angelique","MUSHIMIYIMANA Henriette","NAMAHIRWE Ebenezel","NIKUZWE Divine","NIYONAMBAZA Elina","NIZIGIYIMANA Banjamin","NYIRAMUGISHA Berthilde","NZAYISENGA Vanessa","TUMUKUNDE Kevine","TUYISHIMIRE Marie Grace","TWAGIRIMANA Riberee","UMUKUNDWA Kelly","UMUTONI RUZINDANA Kendra","UWAMAHORO Zawadi","UWAMARIYA Enysia","UWASE Nicole","UWASE SANGWA Kevine","UWAYEZU Fiacrine","UWIMANA Alice","UWITUZE Merca","UWIZEYIMANA Sarah","DUSHIMIMANA Jehovajureh","IRADUHAYE Bless","NIYUBAHWE Giselle","TUYIKUNDE Marie Ange"
  ],
  "S6A": [
    "AHISHAKIYE Annualithe","CYUZUZO Ange Benigne","GIKUNDIRO Kessia","IGIRANEZA Dorcas","IRADUKUNDA Confiance","IRAKOZE Dorcas","ISHIMO AKARIZA Ange Sabrine","ISHIMWE Frank","IYONASENZE Bonheur","KANGUME Ines","MANIRIHO Jean Paul","MUKAHIRWA Benitha","MUKAKWIBUKA Nadine","NDAYISHIMIYE Lambert","NIYIDUHA Carine","NIYONSHUTI Bruno","NTWARI NZABARINDA Guillaume","TETA REPONSE Meghan","UWAMAHORO HIRWA Berthe","UWASE BWANAKWELI Scovia","UWIDUHAYE Belise","UWITUZE Sandrine","YAMURAGIYE Angelique","ZIGIRIMENA Darlene","BENIHIRWE DATIVE","DUSABIRANE DORCAS","IFASHUWACU KEVINE","IMFURANASE AIME PATRICK","INGABIRE DIVINE","IRAKARAMA NATALIE","KABATESI PHIONAH","MUHONGERWA DIANE","MUKAMABANO Agnes","MUKAMUGABO LILIANE","MUKAMUGISHA DEVOTHE","MUKARUKUNDO CLARISSE","MUKESHIMANA MICHELINE","MUNEZERO DENYSE","MUREKAZE GAUDENCE","MUSHIMIYIMANA CLAUDINE","MUTEZIMANA ANGELINA","MUTUYIMANA ANITHA","NISHIMWE UWIJURU ESTHER","NIYIKORA DELIPHINE","NIYITANGINGABIRE LAURENCE","NIYOMUTABAZI ISMAEL","NIYONGIRA INNOCENT","NIYONSENGA CLARISSE","PRINCE Anathole Nobel","SANGWA EDEN SHALOM","TUMUSIFU EVANGELINE","TUYISHIME Eliane","TUYIZERE Marie Ange","UMUHUZA HELENE","UMURISA HOGOZA Benize","UMUTONI Alice","UMUTONIWASE STEPHANIE","UMUTONIWASE enatha","UWABEZA Charlotte","UWAMAHORO BEATHA","UWAMBAJIMANA DIANE","UWINEZA JOSIANE","UWINEZA Henriette","UWIRAGIYE Joselyne","UWUMUGISHA Consolee"
  ],
  "S6B": [
    "BYUKUSENGE Adeline","HAVUGIMANA Girbert","INGABIRE Sifa","IYAMUMPAYE Julienne","MUGANWA Fulgence","MUKIZA Leonce","MUTONIWASE Delphine","NIYIBIZI Samuel","NIYINGABIRA Evelyne","UNEZEREWE Ange Sharom","UWASE Pauline","UWURUKUNDO Rosine","CYUZUZO Angel","DUSHIMIYIMANA Rosine","ISHIMWE Fabiola Aime","ISHIMWE Clarisse","ISHIMWE MPANO Honorine","MANIRATANGA Elie","NAMUKUNDIYICYO Pascaline","NYIRABAGENI Leonille","UMWARIWASE Stella Divine","UWAMURERA Anitha","UWIHANGANYE Ezechiel","DUSINGIZIMANA Queen","AHIMBAZWE CONSTANT","AKURUKUNDO Adeline","DUSHIMIMANA Albine","DUSINGIZIMANA Monica","DUSINGIZIMANA Faustine","GASARO Lucky","IRATUZI PRINCE","ISHIMWE Clementine","IYAMUDUHAYE FORTUNEE","KAYESU HOPE","KAYESU FLORENCE","KIREZI ANGEL","MUGANWA JOYCE","MUGENIWAYEZU HENRIETTE","MUHAWIMANA Aline","MUHORAKEYE ALLIANCE","MUKANDAYISHIMIYE Sylivie","MUTIMAWURUGO ESTHER","MUTONIWASE Bella","NDACYAYISENGA ANITHA","NDAYISHIMIYE SAMUEL","NIKUZE Jean Pierre","NIRERE LOUISE","NIYINDEMERA MUTABARUKA Eunice Helena","NIYINGENERA JOYEUSE","NIYOKWIZERWA LILIANE","NIYONAGIZE AZELE","NYAMPINGA PROVIDENCE","NYIRAKANYANA Sandrine","NYIRANIZEYIMANA Clesence","NYIRIMBABAZI Olive","TUYISENGE SANDRINE","UMURORA JOSIANE","UWAYISENGA ESPERANCE","UWERA Diane","UWIDUHAYE CHARITE","UWINEZA Jeanne d'Arc","UWINGABIRE Albertine","UWIZESERANO SANDRINE","UWONKUNDA Henriette","YEBARE PHIONAH"
  ],
  "L3 SWD": [
    "CYUZUZO Isaac","GIKUNDIRO Sandrine","KURUGISHURI Samson","KWIZERA Gad","MUGISHA Isaac","NIYONKURU Vradimir","UWIDUHAYE Theodette"
  ],
  "L3": [
    "ASHIMWE Christian","BYIRINGIRO Edison","IRANZI GANZA Blaise","IRASUBIZA GIHOZO JOIE Emelyne","IRASUBIZA Theophile","ISHIMWE Prince","ISINGIZWE SHEMA FIACLE","KAREKEZI Elie Jean","MFITUMUKIZA Elishadai","MUHAWENIMANA Janne","MUKAMISHA Gloria","MUNEZERO LUCKY","MUNEZERO Valens","NDAGIJIMANA TETA Nicole","NINZIZA SEBAKUNGU Blaise","NIYOMUGABA Fidele","NIZEYIMANA David","NIZEYIMANA Innocent","NSHIMIYIMANA Gad","NSHIMIYIMANA Obed","NZIGIYIMANA Theobald","RUTANGAYIRE IGANZE David","SHINGIRO Aimable","TURATSINZE Emmanuel","TUYISHIMIRE Girbert","UHAWENAYO FIDELE","UMUTONIWASE Laetitia","UWASE Kevine","UWUJINEMA Clarisse"
  ],
  "L4 SWD": [
    "GISUBIZO HIRWA Bonheur","IRUMVA HIRWA Arsene","ISHEMA Christian","TURINAYO AMANI Basil"
  ],
  "L4": [
    "ABIZERIMANA Benitha","AHISHAKIYE Janvier","BYIRINGIRO Eric","CYUBAHIRO Jackson","HABIMANA Hamis","HIRWA Aimable","IBYIZA Speratha","IGIHOZO Florence","INEZA MUGISHA Landry","INEZA TETA Gloria","IRABIZI Bowaze","IRAGENA Sandrine","IRASUBIZA Emille","IZABAYO Yves","KARANGWA SHEJA Arsene","MANISHIMWE Jean de Dieu","MUGISHA Brian","MUNEZERO Danny","MUSHIMIYIMANA Marie Reine","MUSHIMIYIMANA Sumaya","MUSINGUZI Emmanuel","NDUWAYEZU Theophile","NIRAGIRE Daphine","NISHIMIRWE ISUBIRIZIGIHE Dani","NIWEMUGENI Liliane","NIYOGUSHIMWA Ange Christian","NIYONASENZE Beulla","NYISHIMENTE Naome Nadine","TUGIRINSHUTI Evariste","TURASENGA Captoline","TURINIMANA Augustin","TUYISHIMIRE Solange","UMUTOZO Edouige","UMWARI Josiane","UWAMAHORO Ange UWASE","UWIMBABAZI Lydie","UWIMPUHWE Nadia","UWINGENEYE Claire","UWUMUGISHA Pacifique"
  ],
  "L5": [
    "BIRORI Honorine","CYUZUZO Emile","DUSABE Anne Peline","GIKUNDIRO Shalom","GISUBIZO Jean Claude","IBANENATWE Gisele","INEZA Alida","IRADUKUNDA Josiane","IRAKOZE Hyacinthe","IRANKUNDA Pacifique","IRANZI Naome","ISHIMWE Jeanne Gentille","ISIMBI Golden","IZABAYO Emeritha","KWIZERA Derick","MUGISHA Aime Kevin","MUGISHA Arnold","MUNEZA Hillo Blandeco","MUPENZI Cedrick","NDAHIDWA Arnould","NDATIMANA Dodoce","NDIZIHIWE Alain Delys","NIRERE Evangeline","NISHIMWE Olive","NIYO Esther Kevine","NSHIMIYIMANA Dominique","NTAGARAMA Teta Cynthia","NYIRAGUHIRWA Kevine","NYIRAMANA Jeanne","SHYAKA Clever Prince","TONY RAY Hilde","UMWIZERWA Sandrine","USANASE Benitha","UWASE Belyse","UWASE Gloria","WIBABARA Janici"
  ],
};

async function run() {
  await sequelize.authenticate();
  console.log("✅ Connected to PostgreSQL database");

  const { default: Class } = await import("../models/class");
  const { default: Student } = await import("../models/student");

  let classCounter = 0;
  let studentCounter = 0;
  let skippedClasses = 0;
  let skippedStudents = 0;

  const classIds: Record<string, string> = {};

  for (const [className, students] of Object.entries(classStudentMap)) {
    let [existing] = await sequelize.query(
      `SELECT id FROM classes WHERE "name" = $1 LIMIT 1`,
      { bind: [className], type: QueryTypes.SELECT }
    );
    let classId: string;
    if (existing) {
      classId = (existing as any).id;
      skippedClasses++;
    } else {
      const created = await Class.create({ name: className, isActive: true });
      classId = created.id;
      classCounter++;
    }
    classIds[className] = classId;

    for (const fullName of students) {
      const trimmed = fullName.trim();
      if (!trimmed) continue;
      const [existingStudent] = await sequelize.query(
        `SELECT id FROM students WHERE "fullName" = $1 LIMIT 1`,
        { bind: [trimmed], type: QueryTypes.SELECT }
      );
      if (existingStudent) {
        skippedStudents++;
        continue;
      }
      const studentId = `STU-${className}-${String(studentCounter + 1).padStart(4, "0")}`;
      await Student.create({
        studentId,
        fullName: trimmed,
        classId,
        status: "active",
      });
      studentCounter++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Classes created: ${classCounter}, already existed: ${skippedClasses}`);
  console.log(`   Students created: ${studentCounter}, already existed: ${skippedStudents}`);
  console.log(`   Total classes in map: ${Object.keys(classStudentMap).length}`);
  console.log(`\n🎉 Seeding complete`);
  await sequelize.close();
}

run().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
