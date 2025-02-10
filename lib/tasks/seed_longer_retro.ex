defmodule Mix.Tasks.SeedLongerRetro do
  use Mix.Task

  alias RemoteRetro.{Repo, Retro, Idea}

  @shortdoc "Provides a simple means of seeding longer retros with varying idea counts/lengths"
  def run(_) do
    Mix.Task.run("app.start")

    IO.puts("\n#{IO.ANSI.green()}Persisting records for a long retro...#{IO.ANSI.reset()}\n")

    retro = Repo.insert!(%Retro{facilitator_id: 1, format: "Happy/Sad/Confused", stage: "idea-generation"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "As*gm i**Is*gm is*gm is*gm igm i*Is*gm i**m*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "Ath**Is*gm i*gm i*gm igm i*gm igm i**thp**m*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "Agm i*gm i*gm is*gm i*gm igm th**Is*gm is*gm i/ igm is*gm igm igm igm is*gm is*gm i*"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "A*Is*gm iIs*gm i***!"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A* ith**Is*gm i*gm igm i*Is*gm igm i**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "A*Is*gm i**Is*gm i*Is*gm in**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "A**Is*gm igm i*gm i*Is*gm i*gm i*gm in**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A*gm iIs*gm i*gm i*gm i*Is*gm iIs*gm i**th."
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "A*Is*gm is*gm i**th**cats?"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "A* i*Is*gm iIs*gm is*gm i**Is*gm (s*gm i*Is*gm & igm i**th**skipsN)"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "A*th**Is*gm igm i**Is*gm i**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "A*Is*gm i*gm i**Is*gm i*gm i**+p**m*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "A*: i*gm i*gm is*gm is*gm i*gm igm i**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A* is*gm igm iIs*gm th**Is*gm i*gm i*th**Is*gm i*Is*gm i**th**/m*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A*Is*gm i*Is*gm iIs*gm igm i*gm igm i*gm i*gm igm i*"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "A**Is*gm ith**Is*gm i*gm is*gm i***, i*gm i*Is*gm i*gm i*m*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "Ath**Is*gm i*gm i*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "Agm i*gm i**Is*gm igm i*gm i**. igm is*gm igm igm i*gm i**Is*gm igm iIs*gm ith**Is*gm igm i**."
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A* i**Is*gm is*gm ip**m*n**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*gm igm i*Is*gm i*gm igm i*gm i**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A* i*gm igm i*Is*gm i*gm is*gm ith**Is*gm i*gm ith**Is*gm i*gm is*gm i*gm (Packers/Bears) gm i**m*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "A*Is*gm igm i*Is*gm i*m*n**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*t*c*o**th**Is*gm : i**th/ i*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A* gm i*gm igm iIs*gm igm igm i*gm i*gm iIs*gm igm i**Is*gm igm i*th**Is*gm i*Is*gm i**th?"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "Agm i*gm i**th**Is*gm i*gm iIs*gm (**********, is*gm i**th*, i**)"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "A*gm i**m*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "As*gm th**Is*gm i*gm i**Is*gm i*gm i*gm iIs*gm i**th*m*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*gm i*gm i*m*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body:
        "As*gm i*gm igm i*Is*gm i*gm i*gm is*gm i*gm - i*gm i**th! i*gm igm i*gm igm igm iIs*gm is*gm i*gm (gm i**Is*gm -> i**th***)."
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "Agm i*Is*gm ith**Is*gm i**th***?"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "A*gm 2 igm ith**Is*gm i**th**?"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "A*Is*gm i*Is*gm i*Is*gm i**th**m*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "A00**00"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body:
        "A* igm @ 1gm i*gm i**Is*gm is*gm i*/**Is*gm (*Is*gm is*gm i***), igm is*gm i*gm 80% gm igm iIs*gm i*gm i**th***.  i*Is*gm i***'* i*gm is*gm i***, igm i**?"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*gm is*gm i*gm igm im*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "Agm is*gm i*gm i*th**Is*gm igm i*th**Is*gm i*gm i*gm i*?"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "Agm iIs*gm i*gm iIs*gm th**Is*gm in**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*gm im*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "Agm i**th: i*th**Is*gm i**th**Is*gm igm i**th***. is*gm i**Is*gm iIs*gm igm igm i**Is*gm igm i**th***."
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A**'* iIs*gm igm i**th*! is*gm igm i*m*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "th**Is*gm i*m*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "Agm igm i*Is*gm iIs*gm is*gm i**th**/th**Is*gm i*gm i*"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*gm th**Is*gm igm i**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "As*gm i*gm iIs*gm igm igm i**th**ICA**FBI*!"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "A* i*gm is*gm igm i**th******. i*gm i*gm igm i**th*."
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "AIs*gm ith**Is*gm + i*m*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "Ath**Is*gm is*gm igm i*gm i*Is*gm iIs*gm igm i**m*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A**Is*gm i*m*n**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "Agm i**th*!"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A is*gm i*Is*gm is*gm (*'* i*Is*gm th**Is*gm is*gm i**)"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "As*gm ith**Is*gm i*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "A*->th**Is*gm i**Is*gm iIs*gm is*gm igm igm i*gm th**Is*gm ith**Is*gm i*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A**Is*gm igm i*gm i1 i*gm i*gm igm i*gm i*gm ip**m*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "A*Is*gm i*gm i*gm in**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A***p**m*n**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "A*gm i*Is*gm i**thm*n**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "A/* i**m*n**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*Is*gm igm i**th**?"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "AIs*gm i*"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*gm i*gm i***?"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "A* gm i*gm i*gm i**th****?"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "A*gm igm is*gm igm igm 5gm i**th***? gm i*gm i**Is*gm i***? i*gm i*gm i**Is*gm is*gm is*gm i*?"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "As*gm igm i*gm igm igm i**?"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "confused", body: "A*th**Is*gm igm i**th!"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "Agm igm i*Is*gm & ith**Is*gm is*gm i*gm i**th**m*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "A*gm iIs*gm iIs*gm i*gm i*gm i*gm i*gm im*n**"
    })

    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "sad", body: "A*m*n**"})
    Repo.insert!(%Idea{retro_id: retro.id, user_id: 1, category: "happy", body: "A*Is*gm iIs*gm is*gm im*n**"})

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "A*gm is*gm is*gm igm ith**Is*gm i**th**Is*gm & ith**Is*gm i*Is*gm iIs*gm i**th, is*gm i***!"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "happy",
      body: "Agm i*Is*gm iIs*gm i*gm is*gm iIs*gm i*gm i**Is*gm in**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "A igm i*Is*gm / i*gm igm is*gm i*gm igm igm i/* i*Is*gm i*m*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "A* is*gm i*gm i**Is*gm th**Is*gm igm i**th/CatsInHat?"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "confused",
      body: "Agm i*gm i*gm i**th****/*gm i**Is*gm iIs*gm i***/th**Is*gm i**th!"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "Ath**Is*gm igm iIs*gm i**Is*gm i**th**'* i*th**Is*gm i*gm igm im*n**"
    })

    Repo.insert!(%Idea{
      retro_id: retro.id,
      user_id: 1,
      category: "sad",
      body: "AIs*gm igm i*gm i*gm is*gm igm i**m*n**"
    })

    :timer.sleep(500)

    IO.puts(
      "\n#{IO.ANSI.green()}A long retro has been created!\n  - visit http://localhost:4000/retros/#{retro.id}#{IO.ANSI.reset()}\n"
    )
  end
end
