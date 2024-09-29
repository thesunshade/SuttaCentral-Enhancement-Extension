export function NavigationMenu(): string {
  return `
      		<nav class=" scc-links">	
		<ul class=" list-unstyled mb-0">	
			<li class="text-language ">
				<button class="btn d-inline-flex align-items-left rounded collapsed" data-bs-toggle="collapse" data-bs-target="#palilang" aria-expanded="false">Pāḷi</button>
				<div id="palilang" class="collapse language level1">	
					<ul class="list-unstyled  " >
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#pali-discourses" aria-expanded="false">Discourses&nbsp;<span class="description">Sutta</span></a>
							<div  id="pali-discourses" class="collapse  level2 ">
								<ul class="list-unstyled pl-1">
									<li class="text-group"><a href="https://suttacentral.net/dn" class="btn d-inline-flex">Long Discourses<span>DN</span></a></li>
									<li class="text-group"><a href="https://suttacentral.net/mn" class="btn d-inline-flex">Middle  Discourses <span>MN</span></a></li>
									<li class="text-group has-child"><a class="btn d-inline-flex" data-bs-toggle="collapse" data-bs-target="#SN-sections" aria-expanded="false">Linked Discourses <span> SN</span></a>
										<div class="level3 ">
											<ul id="SN-sections" class="list-unstyled pl-1  collapse">
												<!-- Part 1: The Book with Verses - Sagātthāvagga -->
												<li class="vagga vagatitle collapse multi-collapse">The book with Verses<span>Sagātthāvagga</span></li>																																				
												<li><a href="https://suttacentral.net/sn1"><span class="chapterid">SN1</span> with Devas</a>
													<ul class="vagga collapse multi-collapse" id="sn-Devatasamyutta">
														<li>The chapter on the Reed</li>
														<li>The chapter on the Garden of Delight</li>
														<li>The chapter on a Sword</li>
														<li>The chapter on Sattulapa Group</li>
														<li>The chapter on Fire</li>
														<li>The chapter on Old Age</li>
														<li>The chapter on Oppressed</li>
														<li>The chapter on Incinerated</li>
													</ul>
												</li>
												<li><span class="chapterid">SN2</span> with Clouds</li>
												<li><span class="chapterid">SN3</span>	on Gods</li>
												<li><span class="chapterid">SN4</span>	with King Pasenadi of Kosala</li>
												<li><span class="chapterid">SN5</span>	with Māra</li>
												<li><span class="chapterid">SN6</span>	with Almswomen</li>
												<li><span class="chapterid">SN7</span>	with Brahmā Gods</li>
												<li><span class="chapterid">SN8</span>	with Vangisa</li>
												<li><span class="chapterid">SN9</span>	in the Woods</li>
												<li><span class="chapterid">SN10</span>	with Spirits</li>
												<li><span class="chapterid">SN11</span>	with Sakka</li>
												<li class="vagga vagatitle">The Book of the Causation <span>nīdānavagga</span></li>
												<!-- Part 2: The Book of the Causation - nīdānavagga -->
												<li><span class="chapterid">SN12</span>	on Causation</li>
												<li><span class="chapterid">SN13</span>	on Comprehension</li>
												<li><span class="chapterid">SN14</span>	on Elements</li>
												<li><span class="chapterid">SN15</span>	on Unknowable Beginings</li>
												<li><span class="chapterid">SN16</span>	with Kassapa</li>
												<li><span class="chapterid">SN17</span>	on Gains and Honor</li> 
												<li><span class="chapterid">SN18</span>	with Rāhula</li>
												<li><span class="chapterid">SN19</span>	with Lakkhaṇa</li>
												<li><span class="chapterid">SN12</span> on Causation	</li>
												<li><span class="chapterid">SN13</span> on the Breakthrough	</li>
												<li><span class="chapterid">SN14</span> on Elements	</li>
												<li><span class="chapterid">SN15</span> on Without Discoverable Beginning	</li>
												<li><span class="chapterid">SN16</span> with Kassapa	</li>
												<li><span class="chapterid">SN17</span> on Gains and Honour	</li>
												<li><span class="chapterid">SN18</span> with Rahula	</li>
												<li><span class="chapterid">SN19</span> with Lakkhaṇa	</li>
												<li><span class="chapterid">SN20</span> with Similes	</li>
												<li><span class="chapterid">SN21</span> with Almsmen</li>
												<!-- Part 3: The Book of the Aggregates - Khandavagga -->
												<li class="vagga vagatitle">The Book of the Aggregates <span>Khandavagga</span></li>												
												<li><span class="chapterid">SN22</span> on the Aggregates	</li>
												<li><span class="chapterid">SN23</span> with Radha	</li>
												<li><span class="chapterid">SN24</span> on Views	</li>
												<li><span class="chapterid">SN25</span> on Entering	</li>
												<li><span class="chapterid">SN26</span> on Arising	</li>
												<li><span class="chapterid">SN27</span> on Defilements	</li>
												<li><span class="chapterid">SN28</span> with Sāriputta	</li>
												<li><span class="chapterid">SN29</span> on Nāgas	</li>
												<li><span class="chapterid">SN30</span> on Supaṇṇas	</li>
												<li><span class="chapterid">SN31</span> on Gandhabbas	</li>
												<li><span class="chapterid">SN32</span> on Cloud Devas	</li>
												<li><span class="chapterid">SN33</span> with Vacchagotta	</li>
												<li><span class="chapterid">SN34</span> on Meditation	</li>
												<!-- Part 4: The Book of the Six Sense Bases - Salāyatanavagga -->
												<li class="vagga vagatitle">The Book of the Six Sense Bases <span>Salāyatanavagga</span></li>																								
												<li><span class="chapterid">SN35</span> on the Six Sense Bases	</li>
												<li><span class="chapterid">SN36</span> on Feeling	</li>
												<li><span class="chapterid">SN37</span> on Women	</li>
												<li><span class="chapterid">SN38</span> with Jambukhadaka	</li>
												<li><span class="chapterid">SN39</span> with Samaṇḍaka	</li>
												<li><span class="chapterid">SN40</span> with Moggallana	</li>
												<li><span class="chapterid">SN41</span> with Citta	</li>
												<li><span class="chapterid">SN42</span> to Headmen	</li>
												<li><span class="chapterid">SN43</span> on the Unconditioned	</li>
												<li><span class="chapterid">SN44</span> on the Undeclared	</li>
												<!-- Part 5: The Great Book - Mahāvagga -->
												<li class="vagga vagatitle">The Great Book <span>Mahāvagga</span></li>												
												<li><span class="chapterid">SN45</span> on the Path	</li>
												<li><span class="chapterid">SN46</span> on the Factors of Enlightenment	</li>
												<li><span class="chapterid">SN47</span> on the Establishments of Mindfulness	</li>
												<li><span class="chapterid">SN48</span> on the Faculties	</li>
												<li><span class="chapterid">SN49</span> on the Right Strivings	</li>
												<li><span class="chapterid">SN50</span> on the Powers	</li>
												<li><span class="chapterid">SN51</span> on the Bases for Spiritual Power	</li>
												<li><span class="chapterid">SN52</span> with Anuruddha	</li>
												<li><span class="chapterid">SN53</span> on the jhānas	</li>
												<li><span class="chapterid">SN54</span> on Breathing	</li>
												<li><span class="chapterid">SN55</span> on Stream-Entry	</li>
												<li><span class="chapterid">SN56</span> on the Truths</li>												
											</ul> 
											<!-- sn sections -->
										</div>
									</li>
									<!-- sn -->
									<li class="text-group has-child"><a class="btn d-inline-flex" data-bs-toggle="collapse" data-bs-target="#AN-sections" aria-expanded="false">Numerical Discourses <span>AN</span></a>
										<div class="level3">
											<ul id="AN-sections" class="list-unstyled collapse ">
												<li><span class="chapterid">AN1</span> Book of the Ones</li>
												<li><span class="chapterid">AN2</span> Book of the Twos</li>
												<li><span class="chapterid">AN3</span> Book of the Threes</li>
												<li><span class="chapterid">AN4</span> Book of the Fours</li>
												<li><span class="chapterid">AN5</span> Book of the Fives</li>
												<li><span class="chapterid">AN6</span> Book of the Sixes</li>
												<li><span class="chapterid">AN7</span> Book of the Sevens</li>
												<li><span class="chapterid">AN8</span> Book of the Eights</li>
												<li><span class="chapterid">AN9</span> Book of the Nines</li>
												<li><span class="chapterid">AN10</span> Book of the Tens</li>
												<li><span class="chapterid">AN11</span> Book of the Elevens</li>
											</ul> 
											<!-- an sections -->
										</div>
									</li>
									<!-- an -->									

									<li class="text-group has-child"><a class="btn d-inline-flex" data-bs-toggle="collapse" data-bs-target="#KN-sections" aria-expanded="false">Minor Discourses <span>KN</span></a>
										<div class="level3">
											<ul id="KN-sections" class="list-unstyled collapse ">
												<li><span class="chapterid">KP</span> Basic Passages</li>
												<li><span class="chapterid">DHP</span> Sayings of the Dhamma</li>
												<li><span class="chapterid">UD</span> Heartfelt Sayings</li>
												<li><span class="chapterid">IT</span> Inspired Utterances</li>
												<li><span class="chapterid">THA</span> Verses of the Almsmen</li>
												<li><span class="chapterid">THI</span> Verses of the Almswomen</li>
												<li><span class="chapterid">AN7</span> Book of the Sevens</li>
												<li><span class="chapterid">AN8</span> Book of the Eights</li>
												<li><span class="chapterid">AN9</span> Book of the Nines</li>
												<li><span class="chapterid">AN10</span> Book of the Tens</li>
												<li><span class="chapterid">AN11</span> Book of the Elevens</li>
											</ul> 
											<!-- kn sections -->
										</div>
									</li>
									<!-- kn -->								

								</ul>	
							</div>
						</li>
						<!-- end pi-sutta -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#pali-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Theravāda Vinaya</span></a>
							<div  id="pali-vinaya" class="collapse  level2 ">
								<ul class="list-unstyled">
									<li class="text-group"><a href="#" class="btn d-inline-flex">Almsmens' Rules & Analysis<span>Bhikkhu Vibhaṇga</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Almswomens' Rules & Analysis <span>Bhikkhuni Vibhaṇga</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Chapter on Legal Topics <span>Khandakas</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">The Compendium <span>Parivāra</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Almsmens' Rules<span>Bhikkhu Patimokkha</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Almswomens' Rules <span>Bhikkhuni patimokkha</span></a></li>

								</ul>
							</div>
						</li>
						<!-- end pi-vinaya -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#pali-abhidhamma" aria-expanded="false">Systematic Treastise&nbsp;<span class="description">Abhidhamma</span></a>
							<div  id="pali-abhidhamma" class="collapse  level2 ">

							</div>
						</li>
						<!-- end pi-abhidhamma -->		 				
					</ul>
				</div>
			</li>
			<li class="text-language">
				<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#chineselang" aria-expanded="false">Chinese</button>
				<div id="chineselang" class="collapse level1">	
					<ul class="list-unstyled list-unstyled  " >
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#chinese-discourses" aria-expanded="false">Discourses&nbsp;<span class="description">Sutta</span></a>
							<div  id="chinese-discourses" class="collapse level2">
								<ul class="list-unstyled ">
									<li class="text-group"><a href="#" class="btn d-inline-flex">Long Discourses<span>DA</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Other Long Discourses<span>DA oth</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Middle  Discourses <span>MA</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Other Middle  Discourses <span>MA ot</span></a></li>
								</ul>	
							</div>
						</li>
						<!-- end lz-sutta -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#lz-ms-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Mahāsaṁghika Vinaya</span></a>
							<div  id="lz-ms-vinaya" class="collapse  level2 ">

							</div>
						</li>
						<!-- end lz-ms-vinaya -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#lz-sv-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Saravāstivāda Vinaya</span></a>
							<div  id="lz-sv-vinaya" class="collapse  level2 ">

							</div>
						</li>
						<!-- end lz-sv-vinaya -->						
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#lz-mv-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Mulāsaravāstivāda Vinaya</span></a>
							<div  id="lz-mv-vinaya" class="collapse  level2 ">

							</div>
						</li>
						<!-- end lz-mv-vinaya -->												
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#chinese-abhidhamma" aria-expanded="false">Systematic Treastise&nbsp;<span class="description">Abhidhamma</span></a>
							<div  id="chinese-abhidhamma" class="collapse  level2">

							</div>
						</li>
						<!-- end lz-abhidhamma -->		 						
					</ul>
				</div>
			</li>
<!-- end chinese -->
			<li class="text-language">
				<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#sansritlang" aria-expanded="false">Sanskrit</button>
				<div id="sansritlang" class="collapse level1">	
					<ul class="list-unstyled" >
						<!-- <li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#sansrit-discourses" aria-expanded="false">Discourses&nbsp;<span class="description">Sutta</span></a>
							<div  id="sansrit-discourses" class="collapse level2">
								<ul class="list-unstyled ">
									<li class="text-group"><a href="#" class="btn d-inline-flex">Long Discourses<span>DO</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Middle  Discourses <span>MO</span></a></li>
								</ul>	
							</div>
						</li> -->
						<!-- end san-sutta -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#sk-ms-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Sanksrit Mahāsaṇghika Vinaya</span></a>
							<div  id="sk-ms-vinaya" class="collapse  level2 ">

							</div>
						</li>
						<!-- end sk-ms-vinaya -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#sk-lv-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Sanksrit Lokuttaravāda Vinaya</span></a>
							<div  id="sk-lv-vinaya" class="collapse  level2 ">

							</div>
						</li>
						<!-- end sk-lv-vinaya -->						
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#other-abhidhamma" aria-expanded="false">Systematic Treastise&nbsp;<span class="description">Abhidhamma</span></a>
							<div  id="other-abhidhamma" class="collapse  level2 ">

							</div>
						</li>
						<!-- end lz-abhidhamma -->		 												
					</ul>
				</div>
			</li>
<!-- end sanskrit -->			
			<li class="text-language">
				<button class="btn d-inline-flex align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#otherlang" aria-expanded="false">Other</button>
				<div id="otherlang" class="collapse level1">	
					<ul class="list-unstyled" >
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#other-discourses" aria-expanded="false">Discourses&nbsp;<span class="description">Sutta</span></a>
							<div  id="other-discourses" class="collapse level2">
								<ul class="list-unstyled ">
									<li class="text-group"><a href="#" class="btn d-inline-flex">Long Discourses<span>DO</span></a></li>
									<li class="text-group"><a href="#" class="btn d-inline-flex">Middle  Discourses <span>MO</span></a></li>
								</ul>	
							</div>
						</li>
						<!-- end oth-sutta -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#sk-ms-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Sanksrit Mahāsaṇghika Vinaya</span></a>
							<div  id="sk-ms-vinaya" class="collapse  level2 ">

							</div>
						</li>
						<!-- end sk-ms-vinaya -->
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#sk-lv-vinaya" aria-expanded="false">Monastic Law&nbsp;<span class="description">Sanksrit Lokuttaravāda Vinaya</span></a>
							<div  id="sk-lv-vinaya" class="collapse  level2 ">

							</div>
						</li>
						<!-- end sk-lv-vinaya -->						
						<li class="text-type"><a href="#" class="d-inline-flex align-items-center rounded btn"  data-bs-toggle="collapse" data-bs-target="#other-abhidhamma" aria-expanded="false">Systematic Treastise&nbsp;<span class="description">Abhidhamma</span></a>
							<div  id="other-abhidhamma" class="collapse  level2 ">

							</div>
						</li>
						<!-- end lz-abhidhamma -->		 												
					</ul>
				</div>
			</li>
<!-- end other -->			
		</ul>
	</nav>
    `;
}
