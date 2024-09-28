import { release, ReleaseClient, } from "nx/release"
import { execSync } from "node:child_process"
import fs from "node:fs/promises"
import path from "node:path"
import { NxReleaseConfiguration } from "nx/src/config/nx-json"

async function prerelease() {
    const dryRun = true
    const commit = execSync("git rev-parse --short HEAD").toString().trim()
    const preid = `alpha-${commit}`

    const result = await fs.readFile(path.resolve(__dirname, "..", "nx.json"))
    const config: NxReleaseConfiguration = JSON.parse(result.toString())

    const client = new ReleaseClient({
        ...config,
        projectsRelationship: "fixed"
    })

    const results = await client.releaseVersion({
        specifier: "prerelease",
        preid,
        generatorOptionsOverrides: {
            updateDependents: "never"
        },
        dryRun
    })

    await client.releaseChangelog({
        version: results.workspaceVersion,
        versionData: results.projectsVersionData,
        gitCommit: true,
        dryRun
    })

    await client.releasePublish({
        dryRun,
        verbose: true,
        tag: preid
    })

    process.exit(0)
}

async function version() {
    const result = await fs.readFile(path.resolve(__dirname, "..", "nx.json"))
    const config: NxReleaseConfiguration = JSON.parse(result.toString())

    // use the normal config for normal releases
    const client = new ReleaseClient(config)

    await client.releaseVersion({
        specifier: "minor",
        projects: ["second"],
        dryRun: true
    })

    process.exit(0)
}

prerelease()