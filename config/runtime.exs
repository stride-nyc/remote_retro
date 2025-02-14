# import Config

# if config_env() == :test and System.get_env("WALLABY_LOCAL") do
#   IO.puts "Loading local Wallaby config..."

#   config :wallaby,
#     driver: Wallaby.Chrome,
#     base_url: "http://localhost:4001",
#     chromedriver: [
#       path: Path.expand("bin/chromedriver-mac-arm64/chromedriver", File.cwd!()),
#       headless: false,
#       args: [
#         "--port=4444",
#         "--disable-gpu",
#         "--no-sandbox",
#         "--remote-debugging-port=9222"]
#     ]

#   IO.puts "Chrome path: #{Path.expand("bin/chromedriver-mac-arm64/chromedriver")}"
#   IO.puts "Headless mode: false"
# end
