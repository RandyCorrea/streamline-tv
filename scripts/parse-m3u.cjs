#!/usr/bin/env node
/**
 * M3U Parser Script
 * Converts M3U/M3U8 playlist files to JSON format for the IPTV app
 * 
 * Usage:
 *   node scripts/parse-m3u.js <input.m3u> [output.json]
 * 
 * Example:
 *   node scripts/parse-m3u.js playlist.m3u public/channels.json
 * 
 * To fetch from iptv-org:
 *   curl -o playlist.m3u https://iptv-org.github.io/iptv/index.m3u
 *   node scripts/parse-m3u.js playlist.m3u public/channels.json
 */

const fs = require('fs');
const path = require('path');

function parseM3U(content) {
  const lines = content.split('\n');
  const channels = [];
  let currentChannel = null;
  let id = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Parse the #EXTINF line
      currentChannel = parseExtInf(line, id);
      id++;
    } else if (line && !line.startsWith('#') && currentChannel) {
      // This is the stream URL
      currentChannel.streamUrl = line;
      channels.push(currentChannel);
      currentChannel = null;
    }
  }

  return channels;
}

function parseExtInf(line, id) {
  const channel = {
    id: `channel-${id}`,
    name: 'Unknown Channel',
    logo: '',
    category: 'Uncategorized',
    country: 'Unknown',
    streamUrl: ''
  };

  // Extract tvg-name or channel name
  const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
  if (tvgNameMatch) {
    channel.name = tvgNameMatch[1];
  } else {
    // Fallback: get the name after the comma
    const nameMatch = line.match(/,(.+)$/);
    if (nameMatch) {
      channel.name = nameMatch[1].trim();
    }
  }

  // Extract tvg-logo
  const logoMatch = line.match(/tvg-logo="([^"]*)"/);
  if (logoMatch) {
    channel.logo = logoMatch[1];
  }

  // Extract group-title (category)
  const groupMatch = line.match(/group-title="([^"]*)"/);
  if (groupMatch) {
    channel.category = groupMatch[1] || 'Uncategorized';
  }

  // Extract tvg-country
  const countryMatch = line.match(/tvg-country="([^"]*)"/);
  if (countryMatch) {
    channel.country = countryMatch[1] || 'Unknown';
  }

  return channel;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log('Usage: node parse-m3u.js <input.m3u> [output.json]');
    console.log('');
    console.log('Example:');
    console.log('  node scripts/parse-m3u.js playlist.m3u public/channels.json');
    console.log('');
    console.log('To fetch iptv-org playlist:');
    console.log('  curl -o playlist.m3u https://iptv-org.github.io/iptv/index.m3u');
    process.exit(1);
  }

  const inputFile = args[0];
  const outputFile = args[1] || 'public/channels.json';

  // Check if input file exists
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" not found`);
    process.exit(1);
  }

  console.log(`Reading M3U file: ${inputFile}`);
  const content = fs.readFileSync(inputFile, 'utf-8');

  console.log('Parsing channels...');
  const channels = parseM3U(content);

  // Create output directory if it doesn't exist
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Writing ${channels.length} channels to: ${outputFile}`);
  fs.writeFileSync(outputFile, JSON.stringify(channels, null, 2));

  console.log('Done!');
  console.log('');
  console.log('Categories found:');
  const categories = [...new Set(channels.map(c => c.category))];
  categories.forEach(cat => {
    const count = channels.filter(c => c.category === cat).length;
    console.log(`  - ${cat}: ${count} channels`);
  });
}

main();
