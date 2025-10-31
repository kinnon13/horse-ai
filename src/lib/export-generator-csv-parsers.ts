function createCSVHeader(): string[] {
  return [
    'Horse Name',
    'Breed',
    'Sire',
    'Dam',
    'Earnings',
    'Discipline',
    'Owner',
    'Rider',
    'Recent Results',
    'Progeny',
    'Articles',
    'Social Media',
    'Bloodline',
    'Created Date'
  ]
}

function createHorseCSVRow(horse: any, scraped: any): string[] {
  return [
    horse.name,
    horse.breed,
    horse.sire || '',
    horse.dam || '',
    horse.earnings || 0,
    horse.discipline || '',
    horse.owner_name || '',
    horse.rider_name || '',
    scraped?.recent_results || '',
    scraped?.progeny ? JSON.stringify(scraped.progeny) : '',
    scraped?.articles ? JSON.stringify(scraped.articles) : '',
    scraped?.social_media ? JSON.stringify(scraped.social_media) : '',
    scraped?.bloodline ? JSON.stringify(scraped.bloodline) : '',
    horse.created_at
  ]
}

export { createCSVHeader, createHorseCSVRow }

