interface ProjectBaseConfig {
  is_emulated: boolean
  logo: boolean
}

interface Tags {
  env_tag: string | null
  version: string | null
  branch: string | null
  template_version: string | null
}

interface Window {
  PROJECT_BASE_CONFIG: ProjectBaseConfig
  TAGS: Tags
}
