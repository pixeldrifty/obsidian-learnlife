'use strict';

var obsidian = require('obsidian');

const VIEW_TYPE_MORPHEME = 'morpheme-explorer';

// ─── Wiktionary category map ──────────────────────────────────────────────────

const WIKT_CATEGORIES = {
  'un':     'English words prefixed with un-',
  're':     'English words prefixed with re-',
  'pre':    'English words prefixed with pre-',
  'non':    'English words prefixed with non-',
  'de':     'English words prefixed with de-',
  'dis':    'English words prefixed with dis-',
  'uni':    'English words prefixed with uni-',
  'mono':   'English words prefixed with mono-',
  'bi':     'English words prefixed with bi-',
  'di':     'English words prefixed with di-',
  'anti':   'English words prefixed with anti-',
  'auto':   'English words prefixed with auto-',
  'contra': 'English words prefixed with contra-',
  'para':   'English words prefixed with para-',
  'micro':  'English words prefixed with micro-',
  'macro':  'English words prefixed with macro-',
  'hyper':  'English words prefixed with hyper-',
  'hypo':   'English words prefixed with hypo-',
  'inter':  'English words prefixed with inter-',
  'super':  'English words prefixed with super-',
  'sub':    'English words prefixed with sub-',
  'trans':  'English words prefixed with trans-',
  'poly':   'English words prefixed with poly-',
  'neo':    'English words prefixed with neo-',
  'proto':  'English words prefixed with proto-',
  'semi':   'English words prefixed with semi-',
  'multi':  'English words prefixed with multi-',
  'tele':   'English words prefixed with tele-',
  'photo':  'English words prefixed with photo-',
  'geo':    'English words prefixed with geo-',
  'bio':    'English words prefixed with bio-',
  'ly':     'English words suffixed with -ly',
  'ness':   'English words suffixed with -ness',
  'tion':   'English words suffixed with -tion',
  'er':     'English words suffixed with -er',
  'able':   'English words suffixed with -able',
  'ize':    'English words suffixed with -ize',
  'ment':   'English words suffixed with -ment',
  'ful':    'English words suffixed with -ful',
  'less':   'English words suffixed with -less',
  'ous':    'English words suffixed with -ous',
  'al':     'English words suffixed with -al',
  'ic':     'English words suffixed with -ic',
  'ism':    'English words suffixed with -ism',
  'ist':    'English words suffixed with -ist',
  'ify':    'English words suffixed with -ify',
  'logy':   'English words suffixed with -logy',
};

// ─── Curated database ─────────────────────────────────────────────────────────

const DB = [
  // un-
  { word:'unhappy',    morphemes:['un-','happy'],    parts:[{text:'un-',meaning:'not',type:'prefix',origin:'Old English'},{text:'happy',meaning:'feeling pleasure',type:'root',origin:'Middle English'}], definition:'Not feeling pleasure or contentment.', built:'un- (not) + happy (pleasure) = not feeling pleasure' },
  { word:'undo',       morphemes:['un-','do'],        parts:[{text:'un-',meaning:'reverse',type:'prefix',origin:'Old English'},{text:'do',meaning:'to perform',type:'root',origin:'Old English'}], definition:'To reverse or cancel an action.', built:'un- (reverse) + do (perform) = reverse what was done' },
  { word:'unknown',    morphemes:['un-','known'],     parts:[{text:'un-',meaning:'not',type:'prefix',origin:'Old English'},{text:'known',meaning:'recognized',type:'root',origin:'Old English'}], definition:'Not known or identified.', built:'un- (not) + known (recognized) = not recognized' },
  { word:'unreal',     morphemes:['un-','real'],      parts:[{text:'un-',meaning:'not',type:'prefix',origin:'Old English'},{text:'real',meaning:'actual',type:'root',origin:'Latin'}], definition:'Not real; imaginary or strange.', built:'un- (not) + real (actual) = not actual' },
  { word:'unclear',    morphemes:['un-','clear'],     parts:[{text:'un-',meaning:'not',type:'prefix',origin:'Old English'},{text:'clear',meaning:'easy to understand',type:'root',origin:'Latin'}], definition:'Not easy to see, hear, or understand.', built:'un- (not) + clear (easy to understand) = not easy to understand' },
  { word:'unfair',     morphemes:['un-','fair'],      parts:[{text:'un-',meaning:'not',type:'prefix',origin:'Old English'},{text:'fair',meaning:'just, equitable',type:'root',origin:'Old English'}], definition:'Not fair; unjust.', built:'un- (not) + fair (just) = not just' },
  // re-
  { word:'rebuild',    morphemes:['re-','build'],     parts:[{text:'re-',meaning:'again',type:'prefix',origin:'Latin'},{text:'build',meaning:'construct',type:'root',origin:'Old English'}], definition:'To build again after destruction.', built:'re- (again) + build (construct) = construct again' },
  { word:'return',     morphemes:['re-','turn'],      parts:[{text:'re-',meaning:'back',type:'prefix',origin:'Latin'},{text:'turn',meaning:'move',type:'root',origin:'Old English'}], definition:'To go back to a previous place.', built:'re- (back) + turn (move) = move back' },
  { word:'rewrite',    morphemes:['re-','write'],     parts:[{text:'re-',meaning:'again',type:'prefix',origin:'Latin'},{text:'write',meaning:'inscribe',type:'root',origin:'Old English'}], definition:'To write something again with changes.', built:'re- (again) + write (inscribe) = inscribe again' },
  { word:'reconsider', morphemes:['re-','consider'],  parts:[{text:'re-',meaning:'again',type:'prefix',origin:'Latin'},{text:'consider',meaning:'think about',type:'root',origin:'Latin'}], definition:'To think about a decision again.', built:'re- (again) + consider (think about) = think about again' },
  { word:'recharge',   morphemes:['re-','charge'],    parts:[{text:'re-',meaning:'again',type:'prefix',origin:'Latin'},{text:'charge',meaning:'fill with energy',type:'root',origin:'Old French'}], definition:'To charge a battery or energy source again.', built:'re- (again) + charge (fill) = fill again' },
  // pre-
  { word:'preview',    morphemes:['pre-','view'],     parts:[{text:'pre-',meaning:'before',type:'prefix',origin:'Latin'},{text:'view',meaning:'to see',type:'root',origin:'Anglo-French'}], definition:'An advance showing before official release.', built:'pre- (before) + view (see) = see before' },
  { word:'prehistoric',morphemes:['pre-','historic'], parts:[{text:'pre-',meaning:'before',type:'prefix',origin:'Latin'},{text:'historic',meaning:'recorded history',type:'root',origin:'Greek'}], definition:'Before written historical records.', built:'pre- (before) + historic (recorded history) = before recorded history' },
  { word:'prefix',     morphemes:['pre-','fix'],      parts:[{text:'pre-',meaning:'before',type:'prefix',origin:'Latin'},{text:'fix',meaning:'attach',type:'root',origin:'Latin'}], definition:'A letter or group attached before a root.', built:'pre- (before) + fix (attach) = attach before' },
  { word:'predict',    morphemes:['pre-','dict'],     parts:[{text:'pre-',meaning:'before',type:'prefix',origin:'Latin'},{text:'dict',meaning:'say',type:'root',origin:'Latin'}], definition:'To say what will happen before it occurs.', built:'pre- (before) + dict (say) = say before it happens' },
  { word:'prepare',    morphemes:['pre-','pare'],     parts:[{text:'pre-',meaning:'before',type:'prefix',origin:'Latin'},{text:'pare',meaning:'make ready',type:'root',origin:'Latin'}], definition:'To make ready in advance.', built:'pre- (before) + pare (make ready) = make ready before' },
  // non-
  { word:'nonprofit',  morphemes:['non-','profit'],   parts:[{text:'non-',meaning:'not',type:'prefix',origin:'Latin'},{text:'profit',meaning:'financial gain',type:'root',origin:'Latin'}], definition:'An organization not operating for financial gain.', built:'non- (not) + profit (gain) = not for gain' },
  { word:'nonsense',   morphemes:['non-','sense'],    parts:[{text:'non-',meaning:'not',type:'prefix',origin:'Latin'},{text:'sense',meaning:'meaning',type:'root',origin:'Latin'}], definition:'Words or ideas with no meaning.', built:'non- (not) + sense (meaning) = without meaning' },
  { word:'nonfiction', morphemes:['non-','fiction'],  parts:[{text:'non-',meaning:'not',type:'prefix',origin:'Latin'},{text:'fiction',meaning:'invented story',type:'root',origin:'Latin'}], definition:'Writing based on real events.', built:'non- (not) + fiction (invented) = not invented' },
  { word:'nonverbal',  morphemes:['non-','verbal'],   parts:[{text:'non-',meaning:'not',type:'prefix',origin:'Latin'},{text:'verbal',meaning:'of words',type:'root',origin:'Latin'}], definition:'Not involving words; communicated through gesture.', built:'non- (not) + verbal (words) = not using words' },
  // de-
  { word:'defrost',    morphemes:['de-','frost'],     parts:[{text:'de-',meaning:'remove',type:'prefix',origin:'Latin'},{text:'frost',meaning:'ice',type:'root',origin:'Old English'}], definition:'To remove ice from something.', built:'de- (remove) + frost (ice) = remove ice' },
  { word:'decode',     morphemes:['de-','code'],      parts:[{text:'de-',meaning:'reverse',type:'prefix',origin:'Latin'},{text:'code',meaning:'encoded signal',type:'root',origin:'Latin'}], definition:'To convert a coded message back.', built:'de- (reverse) + code (encoded) = reverse the encoding' },
  { word:'deconstruct',morphemes:['de-','construct'], parts:[{text:'de-',meaning:'undo',type:'prefix',origin:'Latin'},{text:'construct',meaning:'build',type:'root',origin:'Latin'}], definition:'To break something into its component parts.', built:'de- (undo) + construct (build) = undo the building' },
  { word:'detach',     morphemes:['de-','tach'],      parts:[{text:'de-',meaning:'remove',type:'prefix',origin:'Latin'},{text:'tach',meaning:'fasten',type:'root',origin:'Old French'}], definition:'To separate or unfasten.', built:'de- (remove) + tach (fasten) = remove the fastening' },
  { word:'deflate',    morphemes:['de-','flate'],     parts:[{text:'de-',meaning:'reduce',type:'prefix',origin:'Latin'},{text:'flate',meaning:'blow up',type:'root',origin:'Latin'}], definition:'To let air out; to reduce in size or importance.', built:'de- (reduce) + flate (blow up) = reduce what was inflated' },
  // dis-
  { word:'disagree',   morphemes:['dis-','agree'],    parts:[{text:'dis-',meaning:'not',type:'prefix',origin:'Latin'},{text:'agree',meaning:'same mind',type:'root',origin:'Old French'}], definition:'To hold a different opinion.', built:'dis- (not) + agree (same mind) = not of the same mind' },
  { word:'disconnect', morphemes:['dis-','connect'],  parts:[{text:'dis-',meaning:'apart',type:'prefix',origin:'Latin'},{text:'connect',meaning:'join',type:'root',origin:'Latin'}], definition:'To sever a connection.', built:'dis- (apart) + connect (join) = pull apart from joined' },
  { word:'disorder',   morphemes:['dis-','order'],    parts:[{text:'dis-',meaning:'not',type:'prefix',origin:'Latin'},{text:'order',meaning:'arrangement',type:'root',origin:'Latin'}], definition:'A lack of order; confusion.', built:'dis- (not) + order (arrangement) = without arrangement' },
  { word:'disbelief',  morphemes:['dis-','belief'],   parts:[{text:'dis-',meaning:'not',type:'prefix',origin:'Latin'},{text:'belief',meaning:'acceptance of truth',type:'root',origin:'Old English'}], definition:'Inability or refusal to accept something as true.', built:'dis- (not) + belief (acceptance) = not accepting as true' },
  { word:'displace',   morphemes:['dis-','place'],    parts:[{text:'dis-',meaning:'away',type:'prefix',origin:'Latin'},{text:'place',meaning:'position',type:'root',origin:'Old French'}], definition:'To move from the usual or proper position.', built:'dis- (away) + place (position) = move away from position' },
  // uni-
  { word:'unicycle',   morphemes:['uni-','cycle'],    parts:[{text:'uni-',meaning:'one',type:'prefix',origin:'Latin'},{text:'cycle',meaning:'wheel',type:'root',origin:'Greek'}], definition:'A vehicle with only one wheel.', built:'uni- (one) + cycle (wheel) = one wheel' },
  { word:'uniform',    morphemes:['uni-','form'],     parts:[{text:'uni-',meaning:'one',type:'prefix',origin:'Latin'},{text:'form',meaning:'shape',type:'root',origin:'Latin'}], definition:'Remaining the same in all cases.', built:'uni- (one) + form (shape) = one shape' },
  { word:'unify',      morphemes:['uni-','fy'],       parts:[{text:'uni-',meaning:'one',type:'prefix',origin:'Latin'},{text:'-fy',meaning:'make',type:'suffix',origin:'Latin'}], definition:'To make into a single unified whole.', built:'uni (one) + fy (make) = make into one' },
  { word:'universe',   morphemes:['uni-','verse'],    parts:[{text:'uni-',meaning:'one',type:'prefix',origin:'Latin'},{text:'verse',meaning:'turn, whole',type:'root',origin:'Latin'}], definition:'All existing matter, space, and time.', built:'uni (one) + verse (whole) = turned into one whole' },
  // mono-
  { word:'monologue',  morphemes:['mono-','logue'],   parts:[{text:'mono-',meaning:'one, single',type:'prefix',origin:'Greek'},{text:'logue',meaning:'speech',type:'root',origin:'Greek'}], definition:'A long speech by one person.', built:'mono (one) + logue (speech) = speech by one person' },
  { word:'monotone',   morphemes:['mono-','tone'],    parts:[{text:'mono-',meaning:'one',type:'prefix',origin:'Greek'},{text:'tone',meaning:'sound',type:'root',origin:'Greek'}], definition:'A continuous sound on one unvarying pitch.', built:'mono (one) + tone (sound) = one unvarying sound' },
  { word:'monopoly',   morphemes:['mono-','poly'],    parts:[{text:'mono-',meaning:'one, alone',type:'prefix',origin:'Greek'},{text:'poly',meaning:'sell',type:'root',origin:'Greek'}], definition:'Exclusive control over a commodity or market.', built:'mono (alone) + poly (sell) = sell alone' },
  { word:'monochrome', morphemes:['mono-','chrome'],  parts:[{text:'mono-',meaning:'one',type:'prefix',origin:'Greek'},{text:'chrome',meaning:'color',type:'root',origin:'Greek'}], definition:'Done in one color or shades of one color.', built:'mono (one) + chrome (color) = one color' },
  // bi-
  { word:'bicycle',    morphemes:['bi-','cycle'],     parts:[{text:'bi-',meaning:'two',type:'prefix',origin:'Latin'},{text:'cycle',meaning:'wheel',type:'root',origin:'Greek'}], definition:'A vehicle with two wheels driven by pedals.', built:'bi (two) + cycle (wheel) = two wheels' },
  { word:'bilingual',  morphemes:['bi-','lingu','al'],parts:[{text:'bi-',meaning:'two',type:'prefix',origin:'Latin'},{text:'lingu',meaning:'language',type:'root',origin:'Latin'},{text:'-al',meaning:'relating to',type:'suffix',origin:'Latin'}], definition:'Able to speak two languages fluently.', built:'bi (two) + lingu (language) + al = relating to two languages' },
  { word:'biennial',   morphemes:['bi-','enni','al'], parts:[{text:'bi-',meaning:'two',type:'prefix',origin:'Latin'},{text:'enni',meaning:'year',type:'root',origin:'Latin'},{text:'-al',meaning:'relating to',type:'suffix',origin:'Latin'}], definition:'Happening every two years.', built:'bi (two) + enni (year) + al = every two years' },
  { word:'bifocal',    morphemes:['bi-','focal'],     parts:[{text:'bi-',meaning:'two',type:'prefix',origin:'Latin'},{text:'focal',meaning:'point of focus',type:'root',origin:'Latin'}], definition:'Having two different focal lengths.', built:'bi (two) + focal (focus point) = two focus points' },
  // di-
  { word:'dioxide',    morphemes:['di-','ox','ide'],  parts:[{text:'di-',meaning:'two',type:'prefix',origin:'Greek'},{text:'ox',meaning:'oxygen',type:'root',origin:'Greek'},{text:'-ide',meaning:'compound',type:'suffix',origin:'Greek'}], definition:'A compound with two oxygen atoms.', built:'di (two) + ox (oxygen) + ide (compound) = compound with two oxygens' },
  { word:'dilemma',    morphemes:['di-','lemma'],     parts:[{text:'di-',meaning:'two',type:'prefix',origin:'Greek'},{text:'lemma',meaning:'premise',type:'root',origin:'Greek'}], definition:'A situation requiring a choice between two difficult options.', built:'di (two) + lemma (premise) = two difficult premises' },
  // anti-
  { word:'antifreeze', morphemes:['anti-','freeze'],  parts:[{text:'anti-',meaning:'against',type:'prefix',origin:'Greek'},{text:'freeze',meaning:'turn to ice',type:'root',origin:'Old English'}], definition:'A liquid added to water to lower its freezing point.', built:'anti (against) + freeze (ice) = prevents freezing' },
  { word:'antibody',   morphemes:['anti-','body'],    parts:[{text:'anti-',meaning:'against',type:'prefix',origin:'Greek'},{text:'body',meaning:'physical substance',type:'root',origin:'Old English'}], definition:'A protein that neutralizes harmful substances.', built:'anti (against) + body (substance) = works against' },
  { word:'antisocial', morphemes:['anti-','social'],  parts:[{text:'anti-',meaning:'against',type:'prefix',origin:'Greek'},{text:'social',meaning:'society',type:'root',origin:'Latin'}], definition:'Contrary to accepted social norms.', built:'anti (against) + social (society) = against society' },
  { word:'antidote',   morphemes:['anti-','dote'],    parts:[{text:'anti-',meaning:'against',type:'prefix',origin:'Greek'},{text:'dote',meaning:'give',type:'root',origin:'Greek'}], definition:'A medicine given to counteract a poison.', built:'anti (against) + dote (give) = give against' },
  // auto-
  { word:'automatic',     morphemes:['auto-','mat','ic'],      parts:[{text:'auto-',meaning:'self',type:'prefix',origin:'Greek'},{text:'mat',meaning:'moving',type:'root',origin:'Greek'},{text:'-ic',meaning:'having quality of',type:'suffix',origin:'Greek'}], definition:'Working by itself without human intervention.', built:'auto (self) + mat (moving) + ic = self-moving quality' },
  { word:'autobiography', morphemes:['auto-','bio','graph','y'],parts:[{text:'auto-',meaning:'self',type:'prefix',origin:'Greek'},{text:'bio',meaning:'life',type:'root',origin:'Greek'},{text:'graph',meaning:'write',type:'root',origin:'Greek'},{text:'-y',meaning:'state',type:'suffix',origin:'Greek'}], definition:'An account of one\'s own life written by oneself.', built:'auto (self) + bio (life) + graph (write) = writing of one\'s own life' },
  { word:'autopilot',     morphemes:['auto-','pilot'],          parts:[{text:'auto-',meaning:'self',type:'prefix',origin:'Greek'},{text:'pilot',meaning:'steer',type:'root',origin:'Italian'}], definition:'A system that steers a vehicle automatically.', built:'auto (self) + pilot (steer) = steers itself' },
  { word:'autonomy',      morphemes:['auto-','nomy'],           parts:[{text:'auto-',meaning:'self',type:'prefix',origin:'Greek'},{text:'nomy',meaning:'law, management',type:'root',origin:'Greek'}], definition:'The right to govern or manage oneself.', built:'auto (self) + nomy (law) = self-governed by own law' },
  // contra-
  { word:'contradict',    morphemes:['contra-','dict'],         parts:[{text:'contra-',meaning:'against',type:'prefix',origin:'Latin'},{text:'dict',meaning:'say',type:'root',origin:'Latin'}], definition:'To say the opposite of what someone else has said.', built:'contra (against) + dict (say) = say against' },
  { word:'contraband',    morphemes:['contra-','band'],         parts:[{text:'contra-',meaning:'against',type:'prefix',origin:'Latin'},{text:'band',meaning:'decree',type:'root',origin:'Medieval Latin'}], definition:'Goods prohibited from being imported or exported.', built:'contra (against) + band (decree) = against the decree' },
  { word:'contravene',    morphemes:['contra-','vene'],         parts:[{text:'contra-',meaning:'against',type:'prefix',origin:'Latin'},{text:'vene',meaning:'come',type:'root',origin:'Latin'}], definition:'To violate a rule or law.', built:'contra (against) + vene (come) = come against' },
  // para-
  { word:'paradox',    morphemes:['para-','dox'],    parts:[{text:'para-',meaning:'against, beside',type:'prefix',origin:'Greek'},{text:'dox',meaning:'belief',type:'root',origin:'Greek'}], definition:'A statement that contradicts itself but may be true.', built:'para (against) + dox (belief) = against received belief' },
  { word:'parallel',   morphemes:['para-','allel'],  parts:[{text:'para-',meaning:'beside',type:'prefix',origin:'Greek'},{text:'allel',meaning:'one another',type:'root',origin:'Greek'}], definition:'Side by side, always the same distance apart.', built:'para (beside) + allel (one another) = beside one another' },
  { word:'parasite',   morphemes:['para-','site'],   parts:[{text:'para-',meaning:'beside',type:'prefix',origin:'Greek'},{text:'site',meaning:'food',type:'root',origin:'Greek'}], definition:'An organism that lives at the expense of another.', built:'para (beside) + site (food) = feeding beside another' },
  { word:'paranormal', morphemes:['para-','normal'], parts:[{text:'para-',meaning:'beyond',type:'prefix',origin:'Greek'},{text:'normal',meaning:'standard',type:'root',origin:'Latin'}], definition:'Beyond the range of normal scientific explanation.', built:'para (beyond) + normal (standard) = beyond standard' },
  { word:'paramedic',  morphemes:['para-','medic'],  parts:[{text:'para-',meaning:'alongside',type:'prefix',origin:'Greek'},{text:'medic',meaning:'doctor',type:'root',origin:'Latin'}], definition:'A person trained to give emergency medical care.', built:'para (alongside) + medic (medicine) = alongside medicine' },
  // -dox-
  { word:'orthodox',   morphemes:['orth','dox'],     parts:[{text:'orth',meaning:'correct, straight',type:'root',origin:'Greek'},{text:'dox',meaning:'belief',type:'root',origin:'Greek'}], definition:'Conforming to accepted beliefs or doctrines.', built:'orth (correct) + dox (belief) = correct belief' },
  { word:'heterodox',  morphemes:['hetero','dox'],   parts:[{text:'hetero',meaning:'different',type:'root',origin:'Greek'},{text:'dox',meaning:'belief',type:'root',origin:'Greek'}], definition:'Not conforming to accepted standards.', built:'hetero (different) + dox (belief) = different belief' },
  { word:'doxology',   morphemes:['dox','logy'],     parts:[{text:'dox',meaning:'praise, belief',type:'root',origin:'Greek'},{text:'logy',meaning:'discourse',type:'suffix',origin:'Greek'}], definition:'A liturgical formula of praise.', built:'dox (praise) + logy (discourse) = discourse of praise' },
  // -morph-
  { word:'metamorphosis', morphemes:['meta','morph','osis'],    parts:[{text:'meta',meaning:'after, change',type:'prefix',origin:'Greek'},{text:'morph',meaning:'form',type:'root',origin:'Greek'},{text:'osis',meaning:'process',type:'suffix',origin:'Greek'}], definition:'A transformation from one stage to another.', built:'meta (change) + morph (form) + osis (process) = process of changing form' },
  { word:'morphology',    morphemes:['morph','logy'],           parts:[{text:'morph',meaning:'form',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The study of the form and structure of words.', built:'morph (form) + logy (study) = the study of form' },
  { word:'amorphous',     morphemes:['a','morph','ous'],        parts:[{text:'a-',meaning:'without',type:'prefix',origin:'Greek'},{text:'morph',meaning:'form',type:'root',origin:'Greek'},{text:'ous',meaning:'having quality of',type:'suffix',origin:'Latin'}], definition:'Without a clearly defined shape.', built:'a (without) + morph (form) + ous = having no form' },
  { word:'polymorphic',   morphemes:['poly','morph','ic'],      parts:[{text:'poly-',meaning:'many',type:'prefix',origin:'Greek'},{text:'morph',meaning:'form',type:'root',origin:'Greek'},{text:'-ic',meaning:'relating to',type:'suffix',origin:'Greek'}], definition:'Occurring in several different forms.', built:'poly (many) + morph (form) + ic = relating to many forms' },
  // -path-
  { word:'empathy',    morphemes:['em','path','y'],   parts:[{text:'em-',meaning:'in, within',type:'prefix',origin:'Greek'},{text:'path',meaning:'feeling',type:'root',origin:'Greek'},{text:'-y',meaning:'state of',type:'suffix',origin:'Greek'}], definition:'The ability to understand and share another\'s feelings.', built:'em (in) + path (feeling) + y = state of feeling within another' },
  { word:'apathy',     morphemes:['a','path','y'],    parts:[{text:'a-',meaning:'without',type:'prefix',origin:'Greek'},{text:'path',meaning:'feeling',type:'root',origin:'Greek'},{text:'-y',meaning:'state of',type:'suffix',origin:'Greek'}], definition:'Lack of interest, enthusiasm, or concern.', built:'a (without) + path (feeling) + y = state of no feeling' },
  { word:'sympathy',   morphemes:['sym','path','y'],  parts:[{text:'sym-',meaning:'together, with',type:'prefix',origin:'Greek'},{text:'path',meaning:'feeling',type:'root',origin:'Greek'},{text:'-y',meaning:'state of',type:'suffix',origin:'Greek'}], definition:'Feelings of pity for someone else\'s misfortune.', built:'sym (together) + path (feeling) + y = feeling together with' },
  { word:'pathology',  morphemes:['path','logy'],     parts:[{text:'path',meaning:'disease',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The study of the causes and effects of disease.', built:'path (disease) + logy (study) = the study of disease' },
  { word:'sociopath',  morphemes:['socio','path'],    parts:[{text:'socio',meaning:'society',type:'root',origin:'Latin'},{text:'path',meaning:'suffering',type:'root',origin:'Greek'}], definition:'A person with a personality disorder causing antisocial behavior.', built:'socio (society) + path (suffering) = suffering in society' },
  // -graph-
  { word:'photograph',  morphemes:['photo','graph'],   parts:[{text:'photo',meaning:'light',type:'root',origin:'Greek'},{text:'graph',meaning:'write, record',type:'root',origin:'Greek'}], definition:'An image produced by recording light.', built:'photo (light) + graph (record) = record of light' },
  { word:'autograph',   morphemes:['auto','graph'],    parts:[{text:'auto-',meaning:'self',type:'prefix',origin:'Greek'},{text:'graph',meaning:'write',type:'root',origin:'Greek'}], definition:'A person\'s own handwritten signature.', built:'auto (self) + graph (write) = written by oneself' },
  { word:'biography',   morphemes:['bio','graph','y'], parts:[{text:'bio',meaning:'life',type:'root',origin:'Greek'},{text:'graph',meaning:'write',type:'root',origin:'Greek'},{text:'-y',meaning:'state',type:'suffix',origin:'Greek'}], definition:'An account of someone\'s life written by another.', built:'bio (life) + graph (write) + y = writing of a life' },
  { word:'calligraphy', morphemes:['calli','graph','y'],parts:[{text:'calli',meaning:'beautiful',type:'root',origin:'Greek'},{text:'graph',meaning:'write',type:'root',origin:'Greek'},{text:'-y',meaning:'practice',type:'suffix',origin:'Greek'}], definition:'The art of beautiful handwriting.', built:'calli (beautiful) + graph (write) + y = beautiful writing' },
  { word:'cartography', morphemes:['carto','graph','y'],parts:[{text:'carto',meaning:'map',type:'root',origin:'Latin'},{text:'graph',meaning:'draw',type:'root',origin:'Greek'},{text:'-y',meaning:'practice',type:'suffix',origin:'Greek'}], definition:'The science or practice of drawing maps.', built:'carto (map) + graph (draw) + y = practice of drawing maps' },
  // -phone-
  { word:'microphone',  morphemes:['micro','phone'],   parts:[{text:'micro',meaning:'small',type:'prefix',origin:'Greek'},{text:'phone',meaning:'sound, voice',type:'root',origin:'Greek'}], definition:'A device that converts sound into electrical signals.', built:'micro (small) + phone (sound) = makes small sounds larger' },
  { word:'telephone',   morphemes:['tele','phone'],    parts:[{text:'tele',meaning:'far, distant',type:'prefix',origin:'Greek'},{text:'phone',meaning:'sound, voice',type:'root',origin:'Greek'}], definition:'A device for transmitting voice over distance.', built:'tele (far) + phone (voice) = voice over distance' },
  { word:'symphony',    morphemes:['sym','phon','y'],  parts:[{text:'sym-',meaning:'together',type:'prefix',origin:'Greek'},{text:'phon',meaning:'sound',type:'root',origin:'Greek'},{text:'-y',meaning:'quality of',type:'suffix',origin:'Greek'}], definition:'An elaborate musical composition for a full orchestra.', built:'sym (together) + phon (sound) + y = sounds together' },
  { word:'homophone',   morphemes:['homo','phone'],    parts:[{text:'homo',meaning:'same',type:'root',origin:'Greek'},{text:'phone',meaning:'sound',type:'root',origin:'Greek'}], definition:'A word pronounced the same as another but different in meaning.', built:'homo (same) + phone (sound) = same sound' },
  // -logy-
  { word:'biology',      morphemes:['bio','logy'],     parts:[{text:'bio',meaning:'life',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The scientific study of living organisms.', built:'bio (life) + logy (study) = the study of life' },
  { word:'psychology',   morphemes:['psycho','logy'],  parts:[{text:'psycho',meaning:'mind',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The scientific study of the mind and behavior.', built:'psycho (mind) + logy (study) = the study of the mind' },
  { word:'etymology',    morphemes:['etymo','logy'],   parts:[{text:'etymo',meaning:'true sense of a word',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The study of the origin and history of words.', built:'etymo (word origin) + logy (study) = the study of word origins' },
  { word:'geology',      morphemes:['geo','logy'],     parts:[{text:'geo',meaning:'earth',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The science that studies the physical structure of Earth.', built:'geo (earth) + logy (study) = the study of the earth' },
  { word:'anthropology', morphemes:['anthropo','logy'],parts:[{text:'anthropo',meaning:'human',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The study of human societies and cultures.', built:'anthropo (human) + logy (study) = the study of humans' },
  { word:'sociology',    morphemes:['socio','logy'],   parts:[{text:'socio',meaning:'society',type:'root',origin:'Latin'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The study of the development and structure of society.', built:'socio (society) + logy (study) = the study of society' },
  { word:'technology',   morphemes:['techno','logy'],  parts:[{text:'techno',meaning:'skill, craft',type:'root',origin:'Greek'},{text:'logy',meaning:'study of',type:'suffix',origin:'Greek'}], definition:'The application of scientific knowledge for practical purposes.', built:'techno (skill) + logy (study) = the study of practical skills' },
  // -ly
  { word:'genuinely',    morphemes:['genuine','ly'],   parts:[{text:'genuine',meaning:'real, authentic',type:'root',origin:'Latin'},{text:'-ly',meaning:'in the manner of',type:'suffix',origin:'Old English'}], definition:'In a genuine or sincere manner.', built:'genuine (authentic) + ly = in an authentic manner' },
  { word:'quickly',      morphemes:['quick','ly'],     parts:[{text:'quick',meaning:'fast',type:'root',origin:'Old English'},{text:'-ly',meaning:'in the manner of',type:'suffix',origin:'Old English'}], definition:'At a fast speed; rapidly.', built:'quick (fast) + ly = in a fast manner' },
  { word:'clearly',      morphemes:['clear','ly'],     parts:[{text:'clear',meaning:'obvious',type:'root',origin:'Latin'},{text:'-ly',meaning:'in the manner of',type:'suffix',origin:'Old English'}], definition:'Without doubt or confusion.', built:'clear (obvious) + ly = in an obvious manner' },
  { word:'effortlessly', morphemes:['effort','less','ly'],parts:[{text:'effort',meaning:'exertion',type:'root',origin:'Old French'},{text:'-less',meaning:'without',type:'suffix',origin:'Old English'},{text:'-ly',meaning:'in the manner of',type:'suffix',origin:'Old English'}], definition:'Done without exertion; with ease.', built:'effort + less (without) + ly = in a manner without exertion' },
  // -ness
  { word:'darkness',   morphemes:['dark','ness'],    parts:[{text:'dark',meaning:'absence of light',type:'root',origin:'Old English'},{text:'-ness',meaning:'state or quality',type:'suffix',origin:'Old English'}], definition:'The state of being dark; absence of light.', built:'dark (no light) + ness = the state of having no light' },
  { word:'happiness',  morphemes:['happy','ness'],   parts:[{text:'happy',meaning:'feeling pleasure',type:'root',origin:'Middle English'},{text:'-ness',meaning:'state or quality',type:'suffix',origin:'Old English'}], definition:'The state of feeling joy and contentment.', built:'happy (pleasure) + ness = the state of feeling pleasure' },
  { word:'awareness',  morphemes:['aware','ness'],   parts:[{text:'aware',meaning:'having knowledge',type:'root',origin:'Old English'},{text:'-ness',meaning:'state or quality',type:'suffix',origin:'Old English'}], definition:'Knowledge or perception of a situation or fact.', built:'aware (knowing) + ness = the state of knowing' },
  { word:'uniqueness', morphemes:['unique','ness'],  parts:[{text:'unique',meaning:'one of a kind',type:'root',origin:'Latin'},{text:'-ness',meaning:'state or quality',type:'suffix',origin:'Old English'}], definition:'The quality of being unlike anything else.', built:'unique (one of a kind) + ness = the quality of being one of a kind' },
  // -tion
  { word:'construction', morphemes:['construct','ion'],  parts:[{text:'construct',meaning:'build',type:'root',origin:'Latin'},{text:'-ion',meaning:'act or result',type:'suffix',origin:'Latin'}], definition:'The process of building something.', built:'construct (build) + ion = the act of building' },
  { word:'imagination',  morphemes:['imagine','tion'],   parts:[{text:'imagine',meaning:'form a mental image',type:'root',origin:'Latin'},{text:'-tion',meaning:'act or result',type:'suffix',origin:'Latin'}], definition:'The ability to form ideas in the mind.', built:'imagine (form image) + tion = the act of forming images' },
  { word:'definition',   morphemes:['define','tion'],    parts:[{text:'define',meaning:'state the meaning of',type:'root',origin:'Latin'},{text:'-tion',meaning:'act or result',type:'suffix',origin:'Latin'}], definition:'A statement of the exact meaning of a word.', built:'define (state meaning) + tion = result of stating meaning' },
  { word:'transformation',morphemes:['trans','form','ation'],parts:[{text:'trans-',meaning:'across, change',type:'prefix',origin:'Latin'},{text:'form',meaning:'shape',type:'root',origin:'Latin'},{text:'-ation',meaning:'act or result',type:'suffix',origin:'Latin'}], definition:'A marked change in form, nature, or appearance.', built:'trans (change) + form (shape) + ation = act of changing shape' },
  // -er
  { word:'teacher',  morphemes:['teach','er'],   parts:[{text:'teach',meaning:'instruct',type:'root',origin:'Old English'},{text:'-er',meaning:'one who does',type:'suffix',origin:'Old English'}], definition:'A person who teaches.', built:'teach (instruct) + er = one who instructs' },
  { word:'builder',  morphemes:['build','er'],   parts:[{text:'build',meaning:'construct',type:'root',origin:'Old English'},{text:'-er',meaning:'one who does',type:'suffix',origin:'Old English'}], definition:'A person who constructs things.', built:'build (construct) + er = one who constructs' },
  { word:'fighter',  morphemes:['fight','er'],   parts:[{text:'fight',meaning:'struggle, combat',type:'root',origin:'Old English'},{text:'-er',meaning:'one who does',type:'suffix',origin:'Old English'}], definition:'A person or animal that fights.', built:'fight (combat) + er = one who fights' },
  { word:'explorer', morphemes:['explore','er'], parts:[{text:'explore',meaning:'search, investigate',type:'root',origin:'Latin'},{text:'-er',meaning:'one who does',type:'suffix',origin:'Old English'}], definition:'A person who explores unknown regions.', built:'explore (investigate) + er = one who investigates' },
  // -able
  { word:'readable',   morphemes:['read','able'],    parts:[{text:'read',meaning:'interpret text',type:'root',origin:'Old English'},{text:'-able',meaning:'capable of being',type:'suffix',origin:'Latin'}], definition:'Able to be read; clear enough to read.', built:'read (interpret) + able = capable of being read' },
  { word:'remarkable', morphemes:['remark','able'],  parts:[{text:'remark',meaning:'notice, comment on',type:'root',origin:'French'},{text:'-able',meaning:'worthy of',type:'suffix',origin:'Latin'}], definition:'Worthy of attention; extraordinary.', built:'remark (notice) + able = worthy of being noticed' },
  { word:'manageable', morphemes:['manage','able'],  parts:[{text:'manage',meaning:'handle, control',type:'root',origin:'Italian'},{text:'-able',meaning:'capable of being',type:'suffix',origin:'Latin'}], definition:'Able to be controlled or dealt with.', built:'manage (control) + able = capable of being controlled' },
  { word:'believable', morphemes:['believe','able'], parts:[{text:'believe',meaning:'accept as true',type:'root',origin:'Old English'},{text:'-able',meaning:'capable of being',type:'suffix',origin:'Latin'}], definition:'Capable of being believed; credible.', built:'believe (accept as true) + able = capable of being accepted as true' },
  // -ize
  { word:'modernize',  morphemes:['modern','ize'],  parts:[{text:'modern',meaning:'of the present time',type:'root',origin:'Latin'},{text:'-ize',meaning:'make, cause to be',type:'suffix',origin:'Greek'}], definition:'To make something more modern.', built:'modern (present) + ize = make modern' },
  { word:'organize',   morphemes:['organ','ize'],   parts:[{text:'organ',meaning:'instrument, system',type:'root',origin:'Greek'},{text:'-ize',meaning:'make, cause to be',type:'suffix',origin:'Greek'}], definition:'To arrange into a structured whole.', built:'organ (system) + ize = make into a system' },
  { word:'symbolize',  morphemes:['symbol','ize'],  parts:[{text:'symbol',meaning:'sign, token',type:'root',origin:'Greek'},{text:'-ize',meaning:'act as',type:'suffix',origin:'Greek'}], definition:'To be or act as a symbol of something.', built:'symbol (sign) + ize = act as a sign' },
  { word:'memorize',   morphemes:['memor','ize'],   parts:[{text:'memor',meaning:'mindful, remembering',type:'root',origin:'Latin'},{text:'-ize',meaning:'make, cause to be',type:'suffix',origin:'Greek'}], definition:'To commit to memory; learn by heart.', built:'memor (remember) + ize = cause to remember' },
];

// ─── Search ───────────────────────────────────────────────────────────────────

function normalizeQ(s) {
  return s.toLowerCase().replace(/[-\s]/g, '');
}

function matchesMorpheme(entry, rawQuery) {
  const q = normalizeQ(rawQuery);
  if (q.length < 2) return false;
  for (const part of entry.parts) {
    const key = normalizeQ(part.text);
    if (key.length >= 2 && (key === q || key.startsWith(q) || q.startsWith(key))) {
      return true;
    }
  }
  return false;
}

function dedupe(arr) {
  const seen = new Set();
  return arr.filter(e => { if (seen.has(e.word)) return false; seen.add(e.word); return true; });
}

// ─── Wiktionary ───────────────────────────────────────────────────────────────

const wiktCache = {};

async function fetchWiktionary(rawQuery) {
  const q = normalizeQ(rawQuery);
  const cat = WIKT_CATEGORIES[q];
  if (!cat) return null;
  if (wiktCache[q]) return wiktCache[q];

  try {
    const url = `https://en.wiktionary.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(cat)}&cmlimit=80&cmtype=page&format=json&origin=*`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const words = (json?.query?.categorymembers || [])
      .map(m => m.title)
      .filter(t => !t.includes(':') && !t.includes('/') && t.length < 30 && /^[a-zA-Z\s'-]+$/.test(t))
      .sort();
    wiktCache[q] = words;
    return words;
  } catch (e) {
    return null;
  }
}

// ─── View ─────────────────────────────────────────────────────────────────────

class MorphemeExplorerView extends obsidian.ItemView {
  constructor(leaf) {
    super(leaf);
    this.currentWiktKey = null;
    this.debounceTimer = null;
  }

  getViewType()    { return VIEW_TYPE_MORPHEME; }
  getDisplayText() { return 'Morpheme Explorer'; }
  getIcon()        { return 'book-open'; }

  async onOpen() {
    const root = this.containerEl.children[1];
    root.empty();
    root.addClass('me-root');
    this.buildUI(root);
  }

  async onClose() {
    clearTimeout(this.debounceTimer);
  }

  buildUI(root) {
    // Header
    const header = root.createEl('div', { cls: 'me-header' });
    header.createEl('div', { cls: 'me-title', text: 'Morpheme Explorer' });
    header.createEl('div', { cls: 'me-subtitle', text: "type a morpheme — click a word to see how it's built" });

    // Input
    const searchWrap = root.createEl('div', { cls: 'me-search-wrap' });
    this.inputEl = searchWrap.createEl('input', { cls: 'me-input' });
    this.inputEl.type = 'text';
    this.inputEl.placeholder = 'e.g.  auto-   -dox-   -ly   un-';
    this.inputEl.autocomplete = 'off';
    this.inputEl.spellcheck = false;

    // Chips
    const chips = root.createEl('div', { cls: 'me-chips' });
    ['un-','re-','pre-','non-','de-','dis-','auto-','anti-','contra-','para-',
     'uni-','mono-','bi-','di-','-dox-','-morph-','-path-','-graph-','-phone-',
     '-logy-','-ly','-ness','-tion','-er','-able','-ize'].forEach(q => {
      const chip = chips.createEl('span', { cls: 'me-chip', text: q });
      chip.addEventListener('click', () => {
        this.inputEl.value = q;
        this.renderResults(q);
      });
    });

    // Results container
    this.resultsEl = root.createEl('div', { cls: 'me-results' });

    // Wire input
    this.inputEl.addEventListener('input', (e) => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.renderResults(e.target.value), 300);
    });

    this.renderResults('');
  }

  makeCard(entry) {
    const card = this.resultsEl.doc.createElement('div');
    card.className = 'me-card';

    // Header row
    const header = card.createDiv({ cls: 'me-card-header' });
    header.createSpan({ cls: 'me-card-word', text: entry.word });
    const meta = header.createSpan({ cls: 'me-card-meta' });
    meta.createSpan({ text: `${entry.parts.length} part${entry.parts.length !== 1 ? 's' : ''}` });
    meta.createSpan({ cls: 'me-card-toggle', text: '▼' });

    // Body
    const body = card.createDiv({ cls: 'me-card-body' });

    // Morpheme blocks
    const blocks = body.createDiv({ cls: 'me-morph-blocks' });
    entry.parts.forEach((part, i) => {
      if (i > 0) blocks.createSpan({ cls: 'me-plus', text: '+' });
      const block = blocks.createDiv({ cls: `me-morph-block is-${part.type}` });
      block.title = `${part.text} — ${part.meaning} (${part.origin})`;
      block.createSpan({ cls: 'me-morph-text', text: part.text });
      block.createSpan({ cls: 'me-morph-label', text: part.type });
    });

    // Origin tags
    const origins = body.createDiv({ cls: 'me-origin-row' });
    entry.parts.forEach(p => {
      origins.createSpan({ cls: 'me-origin-tag', text: `${p.text} "${p.meaning}"` });
    });

    // Definition
    const def = body.createEl('p', { cls: 'me-definition', text: entry.definition });
    def.style.marginTop = '10px';

    // Derivation
    const deriv = body.createDiv({ cls: 'me-derivation' });
    deriv.createEl('strong', { text: "how it's built: " });
    deriv.appendText(entry.built);

    // Toggle
    header.addEventListener('click', () => {
      const isOpen = card.classList.contains('is-open');
      this.resultsEl.querySelectorAll('.me-card.is-open').forEach(c => c.classList.remove('is-open'));
      if (!isOpen) card.classList.add('is-open');
    });

    return card;
  }

  async renderResults(query) {
    this.resultsEl.empty();
    this.currentWiktKey = normalizeQ(query);

    if (!query || normalizeQ(query).length < 2) {
      this.resultsEl.createEl('p', { cls: 'me-no-results', text: 'type a morpheme to search — use dashes to clarify: un-, -ly, -dox-' });
      return;
    }

    const matches = dedupe(DB.filter(e => matchesMorpheme(e, query)));

    // Curated section
    if (matches.length > 0) {
      this.resultsEl.createEl('p', { cls: 'me-section-label', text: `curated examples (${matches.length})` });
      matches.forEach(e => this.resultsEl.appendChild(this.makeCard(e)));
    } else {
      this.resultsEl.createEl('p', { cls: 'me-no-results', text: `no curated entries for "${query}"` });
    }

    // Wiktionary section
    const q = normalizeQ(query);
    if (!WIKT_CATEGORIES[q]) return;

    const wiktSection = this.resultsEl.createDiv();
    const loadingLabel = wiktSection.createEl('p', { cls: 'me-section-label' });
    loadingLabel.style.marginTop = '10px';
    const spinner = loadingLabel.createSpan({ cls: 'me-spinner' });
    loadingLabel.appendText('loading more from wiktionary…');

    const fetchKey = q;
    const words = await fetchWiktionary(query);

    if (this.currentWiktKey !== fetchKey) return;

    wiktSection.empty();

    if (!words) {
      wiktSection.createEl('p', { cls: 'me-wikt-note', text: 'could not reach wiktionary — check your connection' });
      return;
    }

    const curatedWords = new Set(matches.map(e => e.word.toLowerCase()));
    const extra = words.filter(w => !curatedWords.has(w.toLowerCase()));

    if (extra.length === 0) {
      wiktSection.createEl('p', { cls: 'me-wikt-note', text: 'no additional wiktionary entries found' });
      return;
    }

    const wl = wiktSection.createEl('p', { cls: 'me-section-label', text: `more words from wiktionary (${extra.length})` });
    wl.style.marginTop = '10px';

    extra.forEach(word => {
      const card = wiktSection.createDiv({ cls: 'me-wikt-card' });
      card.createSpan({ cls: 'me-wikt-word', text: word });
      const link = card.createEl('a', { cls: 'me-wikt-link', text: 'wiktionary ↗' });
      link.href = `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}`;
      link.target = '_blank';
      link.rel = 'noopener';
    });
  }
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

class MorphemeExplorerPlugin extends obsidian.Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_MORPHEME, leaf => new MorphemeExplorerView(leaf));

    this.addRibbonIcon('book-open', 'Morpheme Explorer', () => this.activateView());

    this.addCommand({
      id: 'open-morpheme-explorer',
      name: 'Open Morpheme Explorer',
      callback: () => this.activateView(),
    });
  }

  onunload() {
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_MORPHEME);
  }

  async activateView() {
    const { workspace } = this.app;
    let leaf = workspace.getLeavesOfType(VIEW_TYPE_MORPHEME)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_MORPHEME, active: true });
    }
    workspace.revealLeaf(leaf);
  }
}

module.exports = MorphemeExplorerPlugin;
