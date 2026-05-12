# Kimi Multi-Agent Prompt: Dolby Atmos Album Research

You are running a multi-agent research pass for the Artist Demand Index dashboard. Research whether each listed artist has at least one officially released album available in Dolby Atmos / Spatial Audio, then return a single JSON file that can be saved as `data/raw/atmos_album_research.json`.

## Goal

For every artist below, determine whether the artist has at least one album in Dolby Atmos. Do not mark an artist as `false` unless at least one agent has checked reliable sources and found no album-level Atmos availability. If evidence is incomplete, keep the artist in the output but set `hasAtmosAlbum` to `null` and explain the uncertainty in `notes`.

## Research Rules

- Use official or highly reliable sources first: Apple Music Spatial Audio / Dolby Atmos pages, artist/label pages, Dolby editorial pages, official press releases, Tidal/Amazon Music spatial listings when visible, and reputable music industry coverage.
- Count album-level Dolby Atmos or Spatial Audio availability. Do not count a single track, live video, immersive installation, or non-album mix unless the source clearly says the album/release is available in Dolby Atmos.
- Prefer current catalog availability, but include historical evidence if the source makes clear the album was released in Atmos.
- Return every artist exactly once. Keep the `id` values unchanged.
- Use `sourceService` for the service or source family where the Atmos album was confirmed, such as `Apple Music`, `Dolby`, `Tidal`, `Amazon Music`, `Label`, or `Artist site`.
- Use confidence from 1 to 5:
  - `5`: official service/source confirms album-level Atmos availability.
  - `4`: reputable industry or label source confirms it.
  - `3`: credible secondary source, but official listing was not independently visible.
  - `2`: weak or ambiguous evidence.
  - `1`: likely incorrect or unresolved; avoid using this unless the entry remains uncertain.

## Output Format

Return valid JSON only. Do not wrap it in Markdown. Use this exact top-level shape:

```json
{
  "researchedAt": "YYYY-MM-DD",
  "artists": [
    {
      "id": 9,
      "artist": "Beyoncé",
      "hasAtmosAlbum": true,
      "albums": [
        {
          "title": "RENAISSANCE",
          "releaseYear": 2022,
          "sourceService": "Apple Music",
          "sourceUrls": ["https://..."],
          "confidence": 5,
          "notes": "Official service listing confirms Dolby Atmos / Spatial Audio availability."
        }
      ],
      "notes": "List all known album-level Atmos releases found for this artist."
    }
  ]
}
```

Use `hasAtmosAlbum: false` only after research confirms no album-level Atmos availability. Use `hasAtmosAlbum: null` when research remains incomplete or official catalog visibility is unavailable.

## Artist List

1. Acid Pauli
2. AfroRack
3. Air
4. Alva Noto
5. Aphex Twin
6. Arooj Aftab
7. Bassnectar
8. The Beatles
9. Beyoncé
10. Bicep
11. Billie Eilish
12. Björk
13. Bob Dylan
14. Bonobo
15. Brian Eno
16. Cardi B
17. Caribou
18. Carl Craig
19. Channel Tres
20. Charli XCX
21. The Chemical Brothers
22. Christian Marclay
23. Christina Kubisch
24. Christine Sun Kim
25. Cigarettes After Sex
26. Colin Benders
27. DARKSIDE
28. Dave Stewart
29. David Sheppard
30. deadmau5
31. DeLaurentis
32. Ellie Goulding
33. Eurythmics
34. Excision
35. Fatboy Slim
36. FKA twigs
37. Floating Points
38. Flying Lotus
39. Four Tet
40. Fred Again
41. Future
42. Gold Panda
43. Gorillaz
44. Grandbrothers
45. Grimes
46. Halina Rice
47. Halsey
48. Hania Rani
49. Haroon Mirza
50. Holly Herndon
51. Ian Dearden
52. Igor Levit
53. James Blake
54. Jamie xx
55. Janelle Monáe
56. Jennifer Walshe
57. Jon Hopkins
58. Jorja Smith
59. Justin Gray
60. Kaitlyn Aurelia Smith
61. Karlheinz Stockhausen
62. Kelela
63. Kelly Lee Owens
64. Kendrick Lamar
65. Kiasmos
66. Kraftwerk
67. Lady Gaga
68. Lana Del Rey
69. Madame Gandhi
70. Madonna
71. Maribou State
72. Mat Dryhurst
73. Max Cooper
74. Mick Jagger
75. Mike Oldfield
76. Miley Cyrus
77. Moby
78. Moderat
79. Monolake / Robert Henke
80. Naomi Jon
81. Nicolas Jaar
82. Nils Frahm
83. Nine Inch Nails
84. Nitin Sawhney
85. Photay
86. Pink Floyd
87. Portishead
88. Radiohead
89. RAYE
90. Rival Consoles
91. Robyn
92. Romy
93. Ryoji Ikeda
94. Sampha
95. Samson Young
96. Skrillex
97. Sofia Kourtesis
98. Steve Miller Band
99. Steve Reich
100. Steven Wilson
101. Stevie Nicks
102. Suzanne Ciani
103. SZA
104. Talking Heads
105. Tarik Barri
106. Tash Sultana
107. Taylor Swift
108. Thom Yorke
109. Tipper
110. Tourist
111. Tove Lo
112. Travis Scott
113. UNIIQU3
114. The Weeknd
115. Weval
116. The xx
117. Yaeji
118. Yīn Yīn
119. yunè pinku
