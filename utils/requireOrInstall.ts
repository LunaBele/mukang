import { execSync } from "child_process";
import fs from "fs";

export function requireOrInstall < T = any > (pkg: string): T {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(pkg);
  } catch (err) {
    console.log(`📦 Missing package "${pkg}", installing...`);
    
    try {
      // Ensure package.json exists
      if (!fs.existsSync("package.json")) {
        execSync("npm init -y", { stdio: "inherit" });
      }
      
      // Install dependency and save
      execSync(`npm install ${pkg} --save`, { stdio: "inherit" });
      
      console.log(`✅ Installed ${pkg}`);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(pkg);
    } catch (installErr: any) {
      console.error(`❌ Failed to install "${pkg}":`, installErr.message);
      throw installErr;
    }
  }
}