import * as fs from "fs-extra";

const test_input_line = "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))";
const test_input_line_with_newlines = "xmul(2,4)%&mul[3,7]!@^do_\nnot_mul(5,5)+mul(32,64]\nthen(mul(11,8)mul(8,5))";
const test_input_file_contents = fs.readFileSync("./2024/03/input.txt").toString();

describe("parse", () => {
  it("returns the correct results for simple inputs", () => {
    expect(parse(test_input_line, false)).toEqual([
      { command: "multiply", a: 2, b: 4 },
      { command: "multiply", a: 5, b: 5 },
      { command: "multiply", a: 11, b: 8 },
      { command: "multiply", a: 8, b: 5 },
    ]);
    expect(parse(test_input_line_with_newlines, false)).toEqual([
      { command: "multiply", a: 2, b: 4 },
      { command: "multiply", a: 5, b: 5 },
      { command: "multiply", a: 11, b: 8 },
      { command: "multiply", a: 8, b: 5 },
    ]);
    expect(parse(test_input_line_with_newlines, false)).toEqual([
      { command: "multiply", a: 2, b: 4 },
      { command: "multiply", a: 5, b: 5 },
      { command: "multiply", a: 11, b: 8 },
      { command: "multiply", a: 8, b: 5 },
    ]);
    expect(parse("mul(1,2)domul(3,4)don'tdomul(4,5)", false)).toEqual([
      {
        a: 1,
        b: 2,
        command: "multiply",
      },
      {
        a: 3,
        b: 4,
        command: "multiply",
      },
      {
        a: 4,
        b: 5,
        command: "multiply",
      },
    ]);
    expect(parse("mul(1,2)domul(3,4)don'tdomul(4,5)", true)).toEqual<Array<Command>>([
      {
        a: 1,
        b: 2,
        command: "multiply",
      },
      {
        a: 3,
        b: 4,
        command: "multiply",
      },
      {
        a: 4,
        b: 5,
        command: "multiply",
      },
    ]);
    expect(parse(test_input_file_contents, true)).not.toEqual(parse(test_input_file_contents, false));
  });
  it("parses the samples of the large input correctly", () => {
    // why()$mul(735,469)^?!what()don't()~~('mul(982,758)what()^-^who()mul(294,364)&#/ )&%)[~mul(285,81)what()[{where()+ mul(129,761)^]why()>$^<>who()mul(53,344)select()%mul(567,352),mul(915,20)/#(>+^how()'mul(141,658){&~!how()from()?~?who()mul(830,116)#%;mul(139,634)?,#+who()@mul(169,719)[)?'-who();mul(18,751)},when(){;/mul(691,391)mul(856,314)^mul(558,88)]('/>how()@where()(,mul(274,100)%who()#~*mul(220,748)@how(){$how()/*%$when()mul(718,754)[!when(617,291)!{(what()+*do()[;<+ /from()[mul(840,803)}?mul(429,848)?select()how()^why()],&#select()mul(519,894){ !>:^@+mul(522,225)@!^^/'[>select(118,66)>mul(847,195)when(585,749)]mul(641,667):>mul(317,349) +:/^*what()mul(352,440)select()mul(349,981))@mul(450,917)why()how()mul(471,401)?where():}select():mul(632,956))mul(727,370)!}$~*%+$don't()why()select()^]who():mul(276,773)*^^mul(757,668):}mul(232,346)%[*@$ where()mul(898,992)who()why()~+['mul(43,434),where()who()>what()mul(908,953)select();do()}!select()when()!mul(676,368)how()from(966,785)@:$+)how()mul(414,120)mul(108,395) +~{#!@select(),mul(483,964)&do()?>mul(963,893)$,,/%'mul(318,508)?,{mul(390,813)select()>(select()mul(792,357)!{where();mul(717,18)why()$#]why()$^?mul(948,239)how()&>$from()]:>?select()mul(453,180)&&]&,[how()mul(674,281);*how()mul(548,919)how()]{{who()~+where()where()&mul(962,14)/why(),%>when()mul(31,451)/)&:,>}mul(225,266)-*)where()who()]#mul(224,69)#&-+~mul(309,393)@#;%!(][select()mul(389,558)+*how()*^+when()]when()mul(995,181);(mul(5,74)&(#^from()$~&don't()}? ,($ when()mul(216,767)>()!<mul(608,375),*mul(504,987)(/mul(398,418)][mul(39,637)mul(708,979)-]>,/how():@mul(425,905):]>>from()mul(93,831)}select()(mul(70,72)mul(137,510)[]{where()mul(477,400)&?/who()who(335,756){/mul(364,311),$select()what()mul(710,251){mul(351,763)+-}mul(517,661)mul!}?how()where()mul(948,407)-{<]*^from()who()from()mul(979,180)/,:#mul(602,496)%'what(),#}what()~how()mul(343,710))'when()from()#mul(314,877)(+,[?mul(480,685),;do()%<from()}where()]%{#:mul(256,15)]^]mul[$%;where()where()mul(134,380);^where();*mul(505,185)how()what()mul(684,993)%/from(){select()why()mul(265,113)who()@,mul(739,805)what()<}[$$:,mul(570,375))[mul(677,326)-{why()?<how()% mul(186,317)>*<^)from()what()#@what()mul(502,65)where()why()(!*where()from(){/mul(847,541)mul(116,490)]';how(612,404))when()who()&; don't()mul(446,220)(%'?;{^?mul(784,876);)]mul(959,402)%]];mul(362,432)mul(330,805)where()mul(142,473)~don't()-who()mul(965,688)when()[]):-}from()%mul(949,478)why()>~+,!&~,select()mul(633,237!-who()>where()]mul(809,464){@'/when()when()mul(720,462)&select()select() )@}'~how()mul(518,133)mul(512,118)/}what()*][++mul(56,978when(),where()&don't()who()}where()mul(329,879))&$,:when()#when()@what()mul)~who()(;mul(141,130)'?^}#+#from()'-mul(237,78)&what();];%where(614,809){:mul(391,45)mul(787,970)from()-?&~when()mul(59,790) what()where()~?what()mul(399,503)^from()where()when()mul(190,97);why()who() ,select(){mul(428,654)mul(350,302)?{mul(592,241)when()how()mul(705,191)who() !who()mul(50,6)~'from()% &]mul(902,106),select();/ why()from()>mul(800,867)select(659,586)~ )when()}~&'mul(709,298)-:'do()[who()what() mul(31,997)$%(where(309,559)%: mul(177,184)@mul(58,102)

    const result = parse(test_input_file_contents, true);
    expect(result.slice(0, 10)).toEqual([
      { command: "multiply", a: 735, b: 469 },
      { command: "dont" },
      { command: "multiply", a: 982, b: 758 },
      { command: "multiply", a: 294, b: 364 },
      { command: "multiply", a: 285, b: 81 },
      { command: "multiply", a: 129, b: 761 },
      { command: "multiply", a: 53, b: 344 },
      { command: "multiply", a: 567, b: 352 },
      { command: "multiply", a: 915, b: 20 },
      { command: "multiply", a: 141, b: 658 },
    ]);
  });
});

describe("multiplier", () => {
  it("returns the right value for single items", () => {
    expect(multiplier([{ command: "multiply", a: 1, b: 2 }])).toEqual(2);
    expect(multiplier([{ command: "multiply", a: 2, b: 4 }])).toEqual(8);
  });
  it("sums multiples", () => {
    expect(
      multiplier([
        { command: "multiply", a: 2, b: 4 },
        { command: "multiply", a: 2, b: 4 },
      ])
    ).toEqual(16);
  });
});

describe("calculate", () => {
  it("calculates the input string correctly", () => {
    expect(multiplier(parse(test_input_line, false))).toEqual(161);
  });
  it("calculates from the input file", () => {
    expect(multiplier(parse(test_input_file_contents, false))).toEqual(173517243);
  });
  it("calculates from the input file - supports commands", () => {
    expect(multiplier(parse(test_input_file_contents, true))).toEqual(100450138);
  });
});

type Command = MultiplyCommand | DoCommand | DontCommand;
type MultiplyCommand = { command: "multiply"; a: number; b: number };
type DoCommand = { command: "do" };
type DontCommand = { command: "dont" };

function multiplier(commands: Command[]): number {
  let result = 0;
  let enabled = true;
  for (let i = 0; i < commands.length; i++) {
    switch (commands[i].command) {
      case "do":
        enabled = true;
        break;
      case "dont":
        enabled = false;
        break;
      case "multiply":
        if (enabled) {
          const c: MultiplyCommand = commands[i] as MultiplyCommand;
          result += c.a * c.b;
        }
        break;
      default:
        throw new Error("Unhandled command: " + commands[i].command);
    }
  }
  return result;
}

function parse(input: string, supportDoDont: boolean): Command[] {
  const matches = input.match(/mul\((\d+)\,(\d+)\)|don't\(\)|do\(\)/g);
  const result: Command[] = [];
  if (matches) {
    for (const m of matches) {
      if (m === "do()") {
        if (supportDoDont) {
          result.push({ command: "do" });
        }
      } else if (m === "don't()") {
        if (supportDoDont) {
          result.push({ command: "dont" });
        }
      } else {
        const parsed = m.match(/mul\((\d+)\,(\d+)\)/);
        if (parsed === null) {
          throw new Error("parsed was null for element " + m);
        }
        result.push({
          command: "multiply",
          a: parseInt(parsed[1] as string),
          b: parseInt(parsed[2] as string),
        });
      }
    }
  }
  return result;
}
