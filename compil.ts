import { bundle } from "jsr:@deno/emit@^0.40.0";
import { resolve } from "jsr:@std/path@^0.224.0";

const getFile = async (path: string): Promise<string> => {
  if (path.startsWith(`http`)) {
    const response = await fetch(path);
    if (response.ok) {
      const content = await response.text();
      return content;
    } else {
      throw new Error(`Error in fetching file: ${path}`);
    }
  } else {
    return Deno.readTextFileSync(path);
  }
};

const getLines = (text: string, find: string): Array<string> => {
  const lines = text.split(`\n`);
  const result: Array<string> = [];
  lines.forEach((line) => {
    if (line.toLowerCase().includes(find.toLowerCase())) {
      result.push(line);
    }
  });
  return result;
};

const getTsFile = async (path: string): Promise<string> => {
  try {
    let filePath = ``;
    if (path.startsWith(`http`)) {
      filePath = path;
    } else {
      filePath = resolve(Deno.cwd(), path);
    }
    const result = await bundle(filePath);
    const { code } = result;
    return code;
  } catch (error) {
    throw new Error(`error in getting file: ${error}`);
  }
};

const getStyle = async (allStyle: Array<string>) : Promise<{[style:string]:string}> => {
  const objStyle : {[style:string]:string} = {} ;
  for (const link of allStyle) {
    const styleMatch = link.match(/href\s*=\s*"([^"]*)"/);
    if (styleMatch && styleMatch[1]) {
      const style = styleMatch[1];
      if (style.endsWith(`.css`)) {
        const fileContent = await getFile(style);
        objStyle[style] = fileContent;
      }
    }
  }
  return objStyle;
};

const getScript = async (allScript: Array<string>) : Promise<{[script:string]:string}> => {
  const objScript : {[script:string]:string} = {} ;
  for (const script of allScript) {
    const scriptMatch = script.match(/src\s*=\s*"(.*?)"/);
    if (scriptMatch && scriptMatch[1]) {
      const scriptSrc = scriptMatch[1];
      if ((scriptSrc.endsWith(`.ts`)) || (scriptSrc.endsWith(`.js`))) {
        const cttScript = await getTsFile(scriptSrc);
        objScript[scriptSrc] = cttScript;
      }
    }
  }
  return objScript;
};

const main = async (htmlFile: string) => {
  let txtIndex = Deno.readTextFileSync(htmlFile);
  if (txtIndex != null) {

    const allStyle = getLines(txtIndex, `link`);
    const allScript = getLines(txtIndex, `script`);

    const objStyleContent : { [style: string]: string } = await getStyle(allStyle);
    const objScriptContent: { [script: string]: string } =  await getScript(allScript);

    for (const objScript in objScriptContent) {
      const lines = txtIndex.split(`\n`);
      for (const lineRaw in lines) {
        const line = lines[lineRaw].toLowerCase();
        if ( (line.includes(objScript)) && (line.includes(`script`)) && (line.includes(`src`))) {
          const newText = `<script type=module>\n${ objScriptContent[objScript] }\n</script>`;
          const newline = line.replace(/.*/, newText);
lines[lineRaw] = newline;
        }
      }
      txtIndex = lines.join(`\n`);
    }

    for (const objStyle in objStyleContent) {
      const lines: Array<string> = txtIndex.split(`\n`);
      for (const lineRaw in lines) {
        const line = lines[lineRaw].toLowerCase();
        if (
          line.includes(objStyle) && line.includes(`href`) &&
          line.includes(`stylesheet`) && line.includes(`link`)
        ) {
          const newText = `<style>\n${objStyleContent[objStyle]}\n</style>`;
          const newline = line.replace(/.*/, newText);
lines[lineRaw] = newline;
        }
      }
      txtIndex = lines.join(`\n`);
    }
    const outFile = htmlFile.replace(/\.html$/, `.b.html`).replace( /\.htm$/, `.b.htm`,);
    Deno.writeTextFileSync(outFile, txtIndex);
    console.log(`output written to: ${outFile}`);
  }
}

/**
 * function to show help with -h
 */
const showHelp = () => {
  const parts = Deno.mainModule.split(`/`);
  const scriptName = parts[parts.length - 1].replace(/\.ts$/, ``);
  console.log(
    `${scriptName} is simple script to make standalone html file.\n Usage: ${scriptName} [files] ...\n -h  show this help message `,
  );
};

if (Deno.args.length > 0) {
  const firstArg = Deno.args[0];
  if (firstArg == `-h`) {
    showHelp();
  } else {
    for (const args of Deno.args) {
      if (args.endsWith(`.html`) || args.endsWith(`.htm`)) {
        await main(args);
      } else {
        console.error(`Error in ` + args + `: .html or .htm file needed.`);
      }
    }
  }
} else {
  console.error(`Give at least one .html or .htm file.`);
}